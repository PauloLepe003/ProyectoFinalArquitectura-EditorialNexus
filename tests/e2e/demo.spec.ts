import { test, expect, type Page } from '@playwright/test';
const login = async (page: Page, email: string) => {
  await page.goto('/login');
  await page.getByLabel('Correo electrónico').fill(email + '@nexus.local');
  await page.getByLabel('Contraseña', { exact: true }).fill('NexusDemo2026!');
  await page.getByRole('button', { name: 'Iniciar sesión', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
};
test('landing, búsqueda, ficha y diseño móvil', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Tu próxima gran/ })).toBeVisible();
  await expect(page.locator('.hero-book')).toHaveCount(3);
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  await page.goto('/catalogo');
  await page.getByRole('textbox', { name: 'Buscar libros' }).fill('El principito');
  await expect(page.locator('.book-card')).toHaveCount(1);
  await page.locator('.book-card').click();
  await expect(page.getByRole('heading', { name: 'El principito', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Iniciar sesión para comprar' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Tu próxima gran/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
test('flujo minorista: ingresar, carrito persistente y pedido', async ({ page }) => {
  await login(page, 'minorista');
  await page.getByRole('textbox', { name: 'Buscar libros' }).fill('El principito');
  await expect(page.locator('.book-card')).toHaveCount(1);
  await page.locator('.book-card').click();
  await page.getByLabel('Cantidad', { exact: true }).fill('6');
  await page.getByRole('button', { name: 'Añadir al carrito' }).click();
  await expect(page.getByRole('status')).toContainText('Libro añadido');
  await page.getByRole('link', { name: 'Carrito', exact: true }).click();
  await expect(page.locator('.breakdown')).toContainText('Volumen (5%)');
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await page.getByRole('button', { name: 'Confirmar pedido', exact: true }).click();
  await page.getByRole('button', { name: 'Sí, registrar pedido' }).click();
  await expect(page.getByRole('heading', { name: 'Mis pedidos', exact: true })).toBeVisible();
  await expect(page.locator('.order-card').first()).toContainText('Pendiente');
});
test('institución solicita, asesor cotiza y cliente acepta', async ({ page, browser }) => {
  const title = 'Colección E2E ' + Date.now();
  await login(page, 'institucion');
  await page.goto('/requests');
  await page.getByRole('button', { name: 'Nueva solicitud +' }).click();
  await page.getByLabel('Obra o título solicitado').fill(title);
  await page.getByLabel('Cantidad estimada').fill('25');
  await page.getByLabel('Fecha requerida').fill('2099-01-01');
  await page.getByLabel('Acabado de portada').fill('Tapa dura');
  await page.getByLabel('Tipo de papel').fill('Bond');
  await page.getByRole('button', { name: 'Enviar solicitud' }).click();
  await expect(page.locator('.request-card').filter({ hasText: title })).toBeVisible();
  const advisor = await browser.newPage({ baseURL: 'http://127.0.0.1:3001' });
  await login(advisor, 'asesor');
  await advisor.locator('.request-card').filter({ hasText: title }).click();
  await advisor.getByRole('button', { name: 'Emitir cotización', exact: true }).click();
  await advisor.getByLabel('Precio unitario Q').fill('100.00');
  await advisor.getByRole('button', { name: 'Guardar y emitir cotización' }).click();
  await expect(advisor.locator('.quote-box')).toContainText('2,318.40');
  await advisor.screenshot({ path: 'test-results/quote-desktop.png', fullPage: true });
  await advisor.close();
  await page.reload();
  await page.locator('.request-card').filter({ hasText: title }).click();
  await expect(page.locator('.quote-box')).toContainText('2,318.40');
  const pdf = await page.request.get(
    (await page.getByRole('link', { name: 'Descargar PDF' }).getAttribute('href'))!,
  );
  expect(pdf.ok()).toBeTruthy();
  await page.getByRole('button', { name: 'Aceptar propuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar decisión' }).click();
  await expect(page.getByRole('dialog').locator('.badge').first()).toHaveText('Aceptado');
});
test('administrador gestiona categorías, libros y parámetros', async ({ page }) => {
  await login(page, 'admin');
  await expect(page.getByRole('heading', { name: 'Una mirada a tu editorial' })).toBeVisible();
  await page.screenshot({ path: 'test-results/admin-desktop.png', fullPage: true });
  await page.goto('/admin/categories');
  await page.getByRole('button', { name: 'Crear +' }).click();
  const name = 'Categoría E2E ' + Date.now();
  await page.getByLabel('Nombre', { exact: true }).fill(name);
  await page.getByLabel('Descripción', { exact: true }).fill('Creada desde navegador.');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: name })).toBeVisible();
  await page
    .getByRole('row')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Desactivar' })
    .click();
  await page.getByRole('dialog').getByRole('button', { name: 'Desactivar', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: name })).toContainText('Inactivo');
  await page.goto('/admin/books');
  await expect(page.getByRole('table')).toBeVisible();
  await page.getByRole('row').nth(1).getByRole('button', { name: 'Editar', exact: true }).click();
  await expect(page.getByLabel('ISBN (13 dígitos)')).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await page.goto('/admin/settings');
  await page.getByLabel('Tasa de IVA (0.12 = 12%)').fill('0.12');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Parámetros actualizados');
});
