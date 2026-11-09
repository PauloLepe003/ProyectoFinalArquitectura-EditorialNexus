import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as schema from '../validators/schemas.js';
import * as users from '../models/users.js';
import * as catalog from '../models/catalog.js';
import * as orders from '../models/orders.js';
import * as quotes from '../models/quotes.js';
import * as admin from '../models/admin.js';
import { requireRoles } from '../middleware/security.js';
import { renderQuote } from '../views/quotePdf.js';
import { ensure } from '../models/errors.js';
export const api = Router();
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 1000 : 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta en 15 minutos.' },
});
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 8 * 3600000,
  path: '/',
};
api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.get('/auth/me', (_req, res) =>
  res.json({ user: res.locals.session?.user ?? null, csrf: res.locals.session?.csrf ?? null }),
);
api.post('/auth/register', authLimit, async (req, res) =>
  res.status(201).json(await users.register(schema.register.parse(req.body))),
);
api.post('/auth/login', authLimit, async (req, res) => {
  const data = schema.login.parse(req.body);
  const result = await users.login(data.email, data.password, req.cookies?.nexus);
  res.cookie('nexus', result.token, cookieOptions).json({ user: result.user, csrf: result.csrf });
});
api.post('/auth/logout', async (req, res) => {
  await users.logout(req.cookies?.nexus);
  res.clearCookie('nexus', cookieOptions).json({ ok: true });
});
api.patch('/profile', requireRoles(), async (req, res) =>
  res.json(await users.profile(res.locals.session.user.id, schema.profile.parse(req.body).name)),
);
api.get('/catalog', async (req, res) =>
  res.json(await catalog.catalog(schema.catalog.parse(req.query))),
);
api.get('/metadata', async (_req, res) => res.json(await catalog.metadata()));
api.get('/books/:id', async (req, res) =>
  res.json(await catalog.book(schema.id.parse(req.params.id))),
);
api.use('/cart', requireRoles('RETAIL', 'INSTITUTION'));
api.get('/cart', async (_req, res) => res.json(await orders.cart(res.locals.session.user.id)));
api.put('/cart/:id', async (req, res) =>
  res.json(
    await orders.setCart(
      res.locals.session.user.id,
      schema.id.parse(req.params.id),
      schema.cart.parse(req.body).quantity,
    ),
  ),
);
api.delete('/cart/:id', async (req, res) =>
  res.json(await orders.removeCart(res.locals.session.user.id, schema.id.parse(req.params.id))),
);
api.post('/orders', requireRoles('RETAIL', 'INSTITUTION'), async (_req, res) =>
  res.status(201).json(await orders.checkout(res.locals.session.user.id)),
);
api.get('/orders', requireRoles(), async (_req, res) =>
  res.json(await orders.orders(res.locals.session.user.id)),
);
api.get('/orders/:id', requireRoles(), async (req, res) =>
  res.json(
    await orders.order(
      schema.id.parse(req.params.id),
      res.locals.session.user.role === 'ADMIN' ? undefined : res.locals.session.user.id,
    ),
  ),
);
api.use('/requests', requireRoles('INSTITUTION', 'ADVISOR', 'ADMIN'));
api.get('/requests', async (_req, res) =>
  res.json(
    await quotes.requests(
      res.locals.session.user.role === 'INSTITUTION' ? res.locals.session.user.id : undefined,
    ),
  ),
);
api.post('/requests', requireRoles('INSTITUTION'), async (req, res) =>
  res
    .status(201)
    .json(await quotes.createRequest(res.locals.session.user.id, schema.request.parse(req.body))),
);
api.get('/requests/:id', async (req, res) =>
  res.json(
    await quotes.request(
      schema.id.parse(req.params.id),
      res.locals.session.user.role === 'INSTITUTION' ? res.locals.session.user.id : undefined,
    ),
  ),
);
api.post('/requests/:id/quote', requireRoles('ADVISOR', 'ADMIN'), async (req, res) =>
  res.json(
    await quotes.issueQuote(
      schema.id.parse(req.params.id),
      res.locals.session.user.id,
      schema.quote.parse(req.body),
    ),
  ),
);
api.post('/requests/:id/reject', requireRoles('ADVISOR', 'ADMIN'), async (req, res) =>
  res.json(
    await quotes.rejectRequest(
      schema.id.parse(req.params.id),
      res.locals.session.user.id,
      schema.reason.parse(req.body).reason,
    ),
  ),
);
api.post('/requests/:id/decision', requireRoles('INSTITUTION'), async (req, res) =>
  res.json(
    await quotes.decideQuote(
      schema.id.parse(req.params.id),
      res.locals.session.user.id,
      schema.decision.parse(req.body).accept,
    ),
  ),
);
api.get('/requests/:id/pdf', async (req, res) => {
  const row = await quotes.request(
    schema.id.parse(req.params.id),
    res.locals.session.user.role === 'INSTITUTION' ? res.locals.session.user.id : undefined,
  );
  ensure(row.quote, 404, 'La cotización aún no se ha emitido.');
  res.type('pdf').attachment(`cotizacion-NX-${row.quote.number}.pdf`);
  renderQuote(row, res);
});
api.use('/admin', requireRoles('ADMIN'));
api.get('/admin/metrics', async (_req, res) => res.json(await admin.metrics()));
api.get('/admin/settings', async (_req, res) => res.json(await admin.settings()));
api.put('/admin/settings', async (req, res) =>
  res.json(await admin.setTax(schema.settings.parse(req.body).taxRate)),
);
api.get('/admin/books', async (req, res) =>
  res.json(await catalog.catalog(schema.catalog.parse(req.query), true)),
);
api.get('/admin/metadata', async (_req, res) => res.json(await catalog.metadata(true)));
api.post('/admin/books', async (req, res) =>
  res.status(201).json(await catalog.saveBook(undefined, schema.book.parse(req.body))),
);
api.put('/admin/books/:id', async (req, res) =>
  res.json(await catalog.saveBook(schema.id.parse(req.params.id), schema.book.parse(req.body))),
);
api.delete('/admin/books/:id', async (req, res) =>
  res.json(await catalog.deleteBook(schema.id.parse(req.params.id))),
);
for (const kind of ['authors', 'categories'] as const) {
  api.post(`/admin/${kind}`, async (req, res) =>
    res
      .status(201)
      .json(await catalog.saveTaxonomy(kind, undefined, schema.taxonomy.parse(req.body))),
  );
  api.put(`/admin/${kind}/:id`, async (req, res) =>
    res.json(
      await catalog.saveTaxonomy(
        kind,
        schema.id.parse(req.params.id),
        schema.taxonomy.parse(req.body),
      ),
    ),
  );
  api.delete(`/admin/${kind}/:id`, async (req, res) =>
    res.json(await catalog.deleteTaxonomy(kind, schema.id.parse(req.params.id))),
  );
}
api.get('/admin/users', async (req, res) =>
  res.json(await users.listUsers(typeof req.query.q === 'string' ? req.query.q.slice(0, 200) : '')),
);
api.patch('/admin/users/:id', async (req, res) =>
  res.json(
    await users.updateUser(
      res.locals.session.user.id,
      schema.id.parse(req.params.id),
      schema.user.parse(req.body),
    ),
  ),
);
api.get('/admin/orders', async (req, res) =>
  res.json(
    await orders.orders(
      undefined,
      req.query.status ? schema.status.parse({ status: req.query.status }).status : undefined,
    ),
  ),
);
api.patch('/admin/orders/:id', async (req, res) =>
  res.json(
    await orders.changeOrder(
      schema.id.parse(req.params.id),
      schema.status.parse(req.body).status,
      res.locals.session.user.id,
    ),
  ),
);
