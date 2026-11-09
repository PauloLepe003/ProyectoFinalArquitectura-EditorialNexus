# Demostración técnica de 10 minutos

Preparación: iniciar PostgreSQL y la aplicación, abrir http://localhost:3000. Tener dos ventanas de navegador separadas para institución y asesor. No compartir cookies entre los roles. Revisar que existan al menos 25 unidades de El principito y precio Q100; el administrador puede ajustar el inventario antes de presentar. La contraseña de las cinco cuentas es `NexusDemo2026!`.

| Tiempo | Acción y argumento |
|---|---|
| 0:00–0:45 | Presentar Editorial Nexus: catálogo, minoristas e instituciones. Mostrar inicio, portadas y promociones. |
| 0:45–1:45 | Mostrar diagrama MVC y estructura: React no consulta PostgreSQL; controlador valida y autoriza; modelos concentran negocio y Prisma. Abrir `pricing.ts`. |
| 1:45–2:30 | Mostrar ER: usuario/institución, catálogo con relaciones M:N, inventario, pedidos y cotizaciones. Explicar claves, eliminación lógica y snapshots. |
| 2:30–3:30 | Como visitante buscar “principito”, filtrar autor/formato y abrir ficha. Mostrar que comprar requiere autenticarse. |
| 3:30–4:45 | Ingresar como institución aprobada, añadir 25 unidades de El principito. Mostrar base Q2500, volumen Q250, institucional Q180, IVA Q248.40, total Q2318.40. Señalar la aplicación secuencial. |
| 4:45–5:30 | Confirmar pedido, mostrar número e historial. Explicar transacción serializable, decremento condicionado e inmutabilidad. |
| 5:30–7:15 | Crear solicitud de edición especial. En ventana asesor, emitir cotización Q100 por unidad, vigencia futura. Regresar al cliente, descargar PDF y aceptar. Mostrar trazabilidad. |
| 7:15–8:30 | Entrar como admin. Mostrar métricas, editar stock/precio, desactivar/reactivar categoría, aprobar institución pendiente y cambiar estado de pedido. |
| 8:30–9:20 | Mostrar pruebas ejecutadas y evidencia de concurrencia: dos compras compiten por una unidad, una es rechazada. Mostrar rechazo 403 de minorista a administración y protección CSRF. |
| 9:20–10:00 | Mostrar README, DDL/DML, matriz de requisitos y Git. Explicar decisiones: IVA configurable, no pasarela, cotización comercial distinta a orden de stock. Concluir con preguntas. |

## Comandos de respaldo

```powershell
npm run test:unit
npm test
git log --oneline
```

Para una exposición de diez minutos ejecutar la suite completa antes de comenzar y mostrar su reporte; no gastar el tiempo de defensa descargando navegadores o construyendo contenedores.

Si se pierde conexión durante la demo, la aplicación no requiere Internet para el catálogo, la base o las portadas. Si un pedido falla por stock, revisar inventario en administración. No presentar una falla como resultado exitoso.
