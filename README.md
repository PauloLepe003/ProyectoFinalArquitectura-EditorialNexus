# Editorial Nexus

Plataforma editorial MVC para catálogo, compras minoristas e institucionales, solicitudes especiales y cotizaciones digitales. Proyecto académico de Arquitectura de Sistemas, desarrollado a partir de los RF-01 a RF-05 del documento proporcionado.

## Tecnologías y estructura

Node.js 24, TypeScript, Express 5, PostgreSQL 17, Prisma 6, React, Vite, CSS Grid/Flexbox, Zod, bcrypt, Decimal.js, PDFKit, Vitest, Supertest y Playwright. Se eligió CSS directo en lugar de Tailwind para mantener los estilos del proyecto en un único archivo; el PDF permite Grid/Flexbox.

```text
backend/
  prisma/                 # Esquema, migración, datos de demostración
  src/
    models/               # Dominio, persistencia, descuentos y transacciones
    controllers/          # API HTTP y orquestación
    middleware/           # Sesiones, CSRF y autorización
    validators/           # Esquemas Zod
    views/                # Presentación PDF
    config/               # Prisma y transacciones serializables
    tests/                # Pruebas unitarias e integración
frontend/
  src/views/              # Catálogo, cuenta, solicitudes, administración
  src/components/         # Componentes y estados de interfaz
  src/services/           # Cliente HTTP; sin reglas financieras
  src/styles/             # Diseño adaptable
  public/covers/          # 15 portadas SVG originales locales
database/                 # DDL, DML, restricciones de integridad
scripts/                  # Ejecución y exportación local
tests/e2e/                # Demostración automatizada en navegador
docs/                     # Arquitectura, manuales, defensa y pruebas
```

## Inicio rápido con Docker

Requisitos: Docker Engine y Compose en ejecución. El puerto 5438 y el 3000 deben estar libres.

```powershell
Copy-Item .env.example .env
docker compose up --build -d
docker compose logs -f app
```

Abrir **http://localhost:3000**. El contenedor espera a PostgreSQL, aplica migraciones y ejecuta la semilla idempotente. `docker compose down` detiene los servicios y conserva los datos. No usar `down -v` si se quieren conservar pedidos.

El Compose está configurado para demostración HTTP local, enlazado a loopback. Para un despliegue público se necesita HTTPS, `NODE_ENV=production`, `APP_ORIGIN` del dominio y credenciales nuevas. Las cookies incorporan `Secure` en producción.

## Instalación local

Requisitos: Node.js 24 y PostgreSQL 17. Crear una base `nexus` y un usuario propietario. Ajustar `DATABASE_URL` en `.env`.

```powershell
Copy-Item .env.example .env
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
npm start
```

Abrir **http://localhost:3000** y cambiar `APP_ORIGIN=http://localhost:3000` en `.env` para esta ejecución. En desarrollo:

```powershell
npm run dev
```

Abrir **http://localhost:5173** y usar `APP_ORIGIN=http://localhost:5173,http://127.0.0.1:5173` en `.env`. Vite reenvía `/api` a Express; las cookies permanecen en el mismo origen. Express también sirve el frontend compilado desde `dist/`.

### Windows sin Docker

En este equipo se prepara una distribución portátil de PostgreSQL dentro de `.local/`, ignorada por Git. Para iniciarla o detenerla:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 start
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 status
powershell -ExecutionPolicy Bypass -File scripts/local-postgres.ps1 stop
```

Para levantar toda la demostración en este equipo, con dependencias ya instaladas:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/start-demo.ps1
```

Este comando inicia la base, aplica migraciones/semilla, compila y deja Express ejecutándose en segundo plano. Registros en `.local/app.log` y `.local/app-error.log`.

En otro equipo descargar los [binarios oficiales distribuidos por EDB](https://www.enterprisedb.com/download-postgresql-binaries) y extraer `pgsql/bin`, `pgsql/lib` y `pgsql/share` dentro de `.local/`. La distribución está enlazada desde [PostgreSQL para Windows](https://www.postgresql.org/download/windows/). No se necesita instalar un servicio del sistema. El script crea `nexus`, `nexus_test` y `nexus_sql_verify`, escucha solo en `127.0.0.1:5438` y usa autenticación SCRAM.

## Variables de entorno

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL con base y esquema |
| `PORT` | Puerto Express; 3000 por defecto |
| `APP_ORIGIN` | Lista de orígenes exactos permitidos, separados por coma |
| `NODE_ENV` | `development`, `test` o `production`; controla cookie Secure |
| `POSTGRES_PASSWORD` | Contraseña del contenedor PostgreSQL; reemplazar fuera del entorno local |

Las sesiones contienen tokens aleatorios de 256 bits; en PostgreSQL solo se almacena el hash SHA-256 del token. No se necesita una clave de firma de cookies. Las contraseñas se procesan con bcrypt, costo 12. `.env` no se versiona.

## Cuentas de demostración, exclusivamente locales

Contraseña común: **`NexusDemo2026!`**

| Correo | Acceso |
|---|---|
| `admin@nexus.local` | Administración completa |
| `asesor@nexus.local` | Bandeja comercial, emisión/revisión de cotizaciones |
| `minorista@nexus.local` | Carrito y pedidos |
| `institucion@nexus.local` | Institución aprobada, 8% adicional y cotizaciones |
| `pendiente@nexus.local` | Institución pendiente; sin descuento adicional ni solicitudes |
| Sin iniciar sesión | Visitante: catálogo y fichas; sin compras |

El visitante es anónimo, no una sexta cuenta con contraseña. La semilla crea 15 libros, autores, categorías, editoriales, formatos, inventario, un pedido y dos solicitudes (una cotizada). ISBN, ediciones, instituciones y portadas son ejemplos académicos; no representan un catálogo comercial autorizado. Los libros son datos de demostración reales en PostgreSQL, no respuestas simuladas.

La semilla no sobrescribe cambios administrativos ni contraseñas ya existentes. Reejecutarla no duplica los registros iniciales ni vuelve a descontar inventario del pedido de muestra.

## Pruebas

Crear una base separada **`nexus_test`** y un archivo `.env.test`:

```dotenv
DATABASE_URL=postgresql://nexus:nexus_local_only@localhost:5438/nexus_test?schema=public
```

```powershell
npm run test:unit
npm test
npx playwright install chromium
npm run test:all
```

`npm test` aplica migraciones, carga semillas en `nexus_test` y ejecuta Vitest/Supertest. El ejecutor se niega a trabajar si el nombre de base no es `nexus_test`. `test:all` añade Playwright contra un servidor aislado en el puerto 3001; requiere `npm run build` después de modificar el frontend. Los datos de prueba no se eliminan automáticamente. Las pruebas cambian solo la base de pruebas.

En Windows, Playwright usa Edge si está instalado; en ese caso no hace falta descargar Chromium. En otros entornos usa el Chromium instalado por Playwright. Se puede elegir otro canal con `PLAYWRIGHT_CHANNEL`.

Resultados: `test-results/vitest.json`, capturas `test-results/*.png` y `playwright-report/index.html`. Estos artefactos no se versionan. El reporte de resultados reales se registra en [docs/pruebas.md](docs/pruebas.md).

## SQL exportable

Para una base PostgreSQL limpia, ejecutar en este orden:

```powershell
psql -h localhost -p 5438 -U nexus -d base_limpia -v ON_ERROR_STOP=1 -f database/schema.sql
psql -h localhost -p 5438 -U nexus -d base_limpia -v ON_ERROR_STOP=1 -f database/seed.sql
```

El DDL incluye claves, índices, restricciones y protección del desglose financiero histórico. `database/integrity.sql` está integrado en `schema.sql`: **no ejecutarlo nuevamente**. Para ejecutar la aplicación sobre esta importación, configurar `DATABASE_URL` y marcar la migración inicial como aplicada con `npx prisma migrate resolve --applied 202611090001_initial`. Alternativamente usar únicamente `npm run db:migrate` y `npm run db:seed`; no mezclar ambas vías sobre una misma base sin marcar la migración.

## Decisiones de negocio

- Volumen por suma de unidades de todos los títulos: 1–5 = 0%, 6–20 = 5%, 21–50 = 10%, 51+ = 15%.
- Institución aprobada: 8% sobre el subtotal **después** del descuento por volumen.
- IVA inicial 12%, configurable. Es una decisión de implementación solicitada para la demo, no una tasa establecida por el PDF ni asesoría fiscal.
- Dinero: Decimal.js y `NUMERIC(12,2)`, redondeo half-up de cada importe monetario a dos decimales. HTTP transporta importes como strings.
- 25 × Q100 institucional: Q2500 − Q250 − Q180 + Q248.40 = **Q2318.40**.
- El carrito no reserva unidades. El cierre usa transacción serializable y decremento condicionado al stock; se reintentan conflictos hasta tres veces.
- Cancelar un pedido pendiente o aprobado repone stock una sola vez. Un enviado/cancelado es terminal.
- Una cotización aceptada registra el acuerdo comercial; no descuenta existencias ni crea una compra de catálogo porque puede corresponder a una impresión aún no producida.
- Sin pasarela de pago, correos automáticos ni facturación fiscal: el alcance es registro de pedidos y cotizaciones.
- Portadas por asociación de URL HTTPS o SVG local del catálogo. No se reciben archivos arbitrarios; por eso no existe una superficie de subida de archivos sin validación.

## Documentación y defensa

[Arquitectura](docs/arquitectura.md) · [MVC](docs/diagrama-mvc.md) · [Modelo de datos](docs/modelo-datos.md) · [Manual](docs/manual-usuario.md) · [Demo de 10 minutos](docs/demo-10-minutos.md) · [Preguntas de defensa](docs/defensa.md) · [Matriz de cumplimiento](REQUISITOS_CUMPLIDOS.md).

## Problemas comunes

- **Docker no responde:** iniciar Docker Engine/Desktop o usar PostgreSQL local; tener `docker --version` no significa que el motor esté ejecutándose.
- **P1001 / no se conecta:** comprobar puerto 5438, base, contraseña y ejecución de PostgreSQL.
- **403 Origen no permitido:** usar la URL exacta de `APP_ORIGIN`; `localhost` y `127.0.0.1` son distintos orígenes.
- **403 CSRF:** recargar la página e iniciar sesión; cambios de roles invalidan sesiones.
- **401 tras cambiar usuario:** las sesiones expiran a las ocho horas y se revocan al desactivar o modificar permisos.
- **409 Stock insuficiente:** volver al carrito, reducir cantidad y confirmar nuevamente.
- **Sin cotizaciones:** las instituciones pendientes requieren aprobación administrativa.
- **Puerto ocupado:** modificar `PORT` y el proxy de Vite de forma coherente; para Playwright liberar 3001.
- **Error de Prisma Client:** ejecutar `npm run db:generate` después de instalar o cambiar el esquema.

## Git y publicación

Repositorio público publicado con autorización: https://github.com/PauloLepe003/ProyectoFinalArquitectura-EditorialNexus, rama `main`. Para publicar una copia propia en un repositorio nuevo:

```powershell
git status
git remote add origin https://github.com/TU_USUARIO/editorial-nexus.git
git push -u origin main
```

Si la rama local tiene otro nombre, ejecutar primero `git branch -M main`. No agregar `.env`, `.local/`, contraseñas reales ni archivos de sesiones. Propuesta de tres integrantes y ramas en [docs/equipo-git.md](docs/equipo-git.md). Los commits existentes reflejan únicamente el trabajo efectivamente realizado en esta sesión.

## Auditoría final de entrega

Ver [auditoría de 100 puntos](docs/auditoria-final.md). RF-01 a RF-05 verificados. Aplicación local en http://localhost:3000. Comprobaciones adicionales: `node scripts/verify-browser.mjs` y `node scripts/verify-local.mjs`. La sustentación y las contribuciones reales del equipo siguen siendo responsabilidad de sus integrantes.
