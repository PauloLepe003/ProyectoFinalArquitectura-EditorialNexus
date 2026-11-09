// Read-only runtime verification plus PDF download, using the demo database.
import fs from 'node:fs';
const origin = process.env.VERIFY_ORIGIN ?? 'http://localhost:3000';
fs.mkdirSync('test-results', { recursive: true });
const samples = [];
for (let i = 0; i < 10; i++) {
  const start = performance.now();
  const response = await fetch(origin + '/api/catalog?q=principito');
  const body = await response.json();
  if (!response.ok || body.total < 1) throw new Error('Catálogo no disponible');
  samples.push(Math.round(performance.now() - start));
}
const login = await fetch(origin + '/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin },
  body: JSON.stringify({ email: 'institucion@nexus.local', password: 'NexusDemo2026!' }),
});
if (!login.ok) throw new Error('Login de verificación falló');
const cookie = login.headers.get('set-cookie').split(';')[0];
const { csrf } = await login.json();
const requests = await (await fetch(origin + '/api/requests', { headers: { cookie } })).json();
const quote = requests.find((r) => r.quote);
const pdf = await fetch(origin + '/api/requests/' + quote.id + '/pdf', { headers: { cookie } });
if (!pdf.ok) throw new Error('PDF falló');
fs.writeFileSync('test-results/cotizacion-demo.pdf', Buffer.from(await pdf.arrayBuffer()));
await fetch(origin + '/api/auth/logout', {
  method: 'POST',
  headers: { cookie, Origin: origin, 'Content-Type': 'application/json', 'x-csrf-token': csrf },
  body: '{}',
});
const result = {
  date: new Date().toISOString(),
  origin,
  catalogResponseMs: samples,
  averageMs: Math.round(samples.reduce((a, b) => a + b, 0) / samples.length),
  maxMs: Math.max(...samples),
  pdf: 'test-results/cotizacion-demo.pdf',
};
fs.writeFileSync('test-results/local-verification.json', JSON.stringify(result, null, 2));
console.log(result);
