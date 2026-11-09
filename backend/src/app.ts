import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { api } from './controllers/api.js';
import { authenticate, csrf } from './middleware/security.js';
import { DomainError } from './models/errors.js';
export const app = express();
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", 'https:', 'data:'],
        'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
  }),
);
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());
app.use('/api', authenticate, csrf, api);
app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
app.use(express.static(path.resolve('dist')));
app.get('/{*path}', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({
          error: 'Datos inválidos.',
          issues: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
        });
    if (error instanceof DomainError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002')
        return res.status(409).json({ error: 'Ya existe un registro con esos datos únicos.' });
      if (error.code === 'P2025') return res.status(404).json({ error: 'Registro no encontrado.' });
      if (error.code === 'P2003') return res.status(400).json({ error: 'Referencia inválida.' });
      if (error.code === 'P2034')
        return res.status(409).json({ error: 'Operación concurrente. Intenta nuevamente.' });
    }
    if (error instanceof SyntaxError) return res.status(400).json({ error: 'JSON inválido.' });
    console.error(error);
    return res.status(500).json({ error: 'No fue posible completar la operación.' });
  },
);
