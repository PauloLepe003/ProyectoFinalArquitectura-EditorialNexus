import { chromium } from 'playwright';
import fs from 'node:fs';
const browser = await chromium.launch({
  channel:
    process.env.PLAYWRIGHT_CHANNEL ||
    (fs.existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
      ? 'msedge'
      : undefined),
});
const results = [];
for (const width of [1440, 768, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const route of ['/', '/catalogo', '/login', '/register']) {
    const start = performance.now();
    await page.goto('http://localhost:3000' + route);
    if (route === '/' || route === '/catalogo') await page.locator('.book-card').first().waitFor();
    else await page.locator('form').waitFor();
    const readyMs = Math.round(performance.now() - start);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    results.push({ width, route, readyMs, overflow, errors: [...errors] });
    if (overflow || errors.length) throw new Error('Browser validation failed');
  }
  await context.close();
}
for (const [account, routes] of [
  [
    'admin',
    [
      '/admin',
      '/admin/books',
      '/admin/authors',
      '/admin/categories',
      '/admin/users',
      '/admin/orders',
      '/admin/settings',
    ],
  ],
  ['asesor', ['/requests']],
  ['institucion', ['/cart', '/orders', '/requests', '/profile']],
]) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:3000/login');
  await page.getByLabel('Correo electrónico').fill(account + '@nexus.local');
  await page.getByLabel('Contraseña', { exact: true }).fill('NexusDemo2026!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await page.getByRole('button', { name: 'Cerrar sesión' }).waitFor();
  for (const route of routes) {
    const start = performance.now();
    await page.goto('http://localhost:3000' + route);
    await page.locator('main h1').waitFor();
    await page.waitForFunction(() => !document.querySelector('.spinner'));
    const readyMs = Math.round(performance.now() - start);
    results.push({ account, route, readyMs });
  }
  await context.close();
}
await browser.close();
fs.mkdirSync('docs/evidence', { recursive: true });
fs.writeFileSync(
  'docs/evidence/browser-performance.json',
  JSON.stringify({ date: new Date().toISOString(), results }, null, 2),
);
console.log(results);
if (results.some((r) => r.readyMs >= 2000)) process.exitCode = 1;
