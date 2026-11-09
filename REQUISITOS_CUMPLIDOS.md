# Matriz de cumplimiento y evidencia

Fuente principal: las seis páginas de la guía de Arquitectura de Sistemas proporcionada. La solicitud ampliada añade pruebas, PDF de cotización y más documentación. “Completo” significa implementado y verificado; no equivale a una calificación docente.

Verificación: build correcto, 42/42 pruebas unitarias e integración aprobadas, suite E2E aprobada. DDL/DML importados en base limpia y DML repetido sin errores.

| ID | Requisito | Implementación | Validación | Estado |
|---|---|---|---|---|
| RF-01.1 | Inicio, destacados, novedades y promociones | `frontend/src/views/Catalog.tsx`, `models/catalog.ts` | E2E landing y capturas | Completo |
| RF-01.2 | Búsqueda título/autor/ISBN/editorial y filtros combinables | `catalog.ts`, `validators/schemas.ts`, `Catalog.tsx` | API búsqueda/filtros/paginación, E2E catálogo | Completo |
| RF-01.3 | Ficha técnica completa y portada | `Catalog.tsx:BookDetail`, `Book`, portadas SVG | API ficha y E2E detalle | Completo |
| RF-02 | Visitante, minorista, institución, asesor y administrador | `users.ts`, `middleware/security.ts`, `controllers/api.ts`, `Account.tsx` | Registro, login, hash, cookie, 401/403, propiedad | Completo |
| RF-03.1 | Carrito persistente, añadir/modificar/eliminar | `models/orders.ts`, `Account.tsx:Cart`, `CartItem` | Carrito entre sesiones, cambios, eliminación y E2E | Completo |
| RF-03.2 | Descuentos por volumen y 8% secuencial solo en Modelo | `models/pricing.ts` | 12 pruebas unitarias ejecutadas; límites y Q2318.40 | Completo |
| RF-03.3 | Cierre con desglose, impuesto, persistencia y stock | `orders.ts`, `Order`, `OrderItem`, triggers | Integración exactitud, propiedad y concurrencia | Completo |
| RF-04.1 | Ediciones especiales, demanda y volumen sin stock | `quotes.ts:createRequest`, `Requests.tsx` | API flujo comercial y E2E | Completo |
| RF-04.2 | Título, cantidad, portada, papel, fecha y observaciones | `schemas.ts:request`, `Requests.tsx` | API validación y E2E formulario | Completo |
| RF-04.3 | Bandeja asesor, revisión, cotización y decisión cliente | `quotes.ts`, `Requests.tsx`, `quotePdf.ts` | API emisión/revisión/rechazo/PDF/aceptación y E2E | Completo |
| RF-05.1 | CRUD lógico libros/autores/categorías e inventario | `catalog.ts`, `Admin.tsx` | API CRUD y E2E administración | Completo |
| RF-05.2 | Órdenes, filtros de estado y seguimiento | `orders.ts:changeOrder`, `Admin.tsx:AdminOrders` | API transición/cancelación e historial | Completo |
| RF-05.3 | Gestión comercial por asesor | `api.ts`, `quotes.ts`, `Requests.tsx` | API RBAC y E2E dos sesiones | Completo |
| RNF-4.1 | MVC estricto | `models/`, `controllers/`, `frontend/`, vista PDF | Revisión de imports, build y docs | Completo |
| RNF-4.2 | Hash, validación, SQL seguro, XSS/CSRF y autorización | bcrypt, Zod, Prisma, React, Helmet, CSRF, RBAC | API seguridad y auditoría dependencias | Completo |
| RNF-4.3 | Responsive, usabilidad y carga local <2 segundos | CSS Grid/Flexbox y estados | E2E escritorio/móvil y medición local | Parcial: responsive probado; rendimiento completo pendiente |
| RNF-4.4 | Git, commits y propuesta de ramas | `.gitignore`, `docs/equipo-git.md` | `git log`, revisión de archivos ignorados | Completo |
| ENT-01 | Fuente completa y repositorio público | Repositorio local | Git local; publicación no autorizada | Parcial: publicación GitHub autorizada en proceso |
| ENT-02 | DDL/DML, ≥10 libros y cinco usuarios | Prisma, `database/`, semilla 15 libros/5 cuentas | Migración, semilla doble, importación limpia | Completo |
| ENT-03 | Diagrama, estructura, instalación y credenciales | README y `docs/` | Revisión documental y comandos locales | Completo |
| ENT-04 | Defensa en vivo de 10 minutos | `docs/demo-10-minutos.md`, `docs/defensa.md` | Guion disponible; presentación humana externa | Parcial: exposición pendiente del equipo |

## Requisitos adicionales de la solicitud

| Extensión | Evidencia |
|---|---|
| Aprobación/rechazo institucional y gestión de roles | `models/users.ts:updateUser`, UI Usuarios, revocación de sesiones |
| Perfil, logout y errores de formulario | `Account.tsx`, `ActionForm`, middleware HTTP |
| Histórico financiero inmutable | `Order.breakdown`, columnas de `OrderItem`, triggers `database/integrity.sql` |
| Cotización PDF y trazabilidad | `quotePdf.ts`, `RequestHistory`, snapshots de revisiones |
| Métricas desde la base e IVA editable | `models/admin.ts`, dashboard y parámetros |
| Transacciones y stock no negativo | Serializable, actualización condicional, CHECK y reintento limitado |
| Asociación de portadas | URL HTTPS o SVG local; no se implementa subida de archivos arbitrarios |
| SQL reproducible y semilla idempotente | DDL y exportación DML más script Prisma; comprobación pendiente |
| Docker Compose | Configuración entregada; motor Docker no disponible en este equipo |
| Pruebas aisladas | `scripts/test-db.mjs` exige `nexus_test` |
| Organización para tres integrantes | Propuesta expresa sin atribuciones ficticias en `docs/equipo-git.md` |

## Auditoría de rúbrica

No se asigna 100/100 de forma automática. La estimación final se completará con resultados verificables en `docs/pruebas.md`; publicación, contribuciones de tres personas y sustentación en vivo no pueden darse por realizadas desde esta sesión.
