# Preguntas de defensa técnica

**¿Dónde se cumple MVC?** El Modelo está en `backend/src/models`; allí están Prisma, estados, precios, descuentos y transacciones. El Controlador valida HTTP, exige permisos y llama al Modelo. React y la vista PDF solo presentan resultados.

**¿Por qué React puede ser Vista aunque sea una SPA?** MVC describe separación de responsabilidades, no obliga a renderizar HTML en servidor. React consume datos explícitos del controlador y no accede a persistencia.

**¿Dónde está el motor de descuentos?** Solo en `pricing.ts`. Carrito, orden y cotización lo invocan. Ningún controlador decide tasas ni calcula subtotales.

**¿Por qué 10% + 8% no es 18%?** El 8% se aplica después del descuento por volumen: 2500 × 0.90 × 0.92 = 2070. El descuento efectivo es 17.2%, antes de IVA.

**¿Por qué no usar `number` para dinero?** La representación binaria de decimales puede introducir error. Se usa Decimal.js, `NUMERIC(12,2)` y strings en JSON; redondeo half-up a centavos en cada paso monetario.

**¿El PDF establece IVA 12%?** No. Es un parámetro inicial solicitado para Guatemala en la demostración, documentado y editable por administrador. Los pedidos guardan la tasa aplicada.

**¿Por qué Prisma?** Tipado de entidades, relaciones, migraciones y consultas parametrizadas. No sustituye validación ni autorización: ambas se implementan explícitamente.

**¿Cómo impiden sobreventa?** Transacción serializable con actualización condicionada a existencias suficientes y rollback si falla cualquier producto. Conflictos de serialización se reintentan de forma limitada. Hay prueba concurrente contra PostgreSQL.

**¿Qué pasa si cambia el precio después de comprar?** El detalle guarda el precio y título históricos; el desglose se conserva como snapshot y tiene un trigger que impide modificarlo.

**¿Qué hace la cancelación?** Permite Pendiente/Aprobado → Cancelado y repone inventario dentro de la misma transacción. El estado cancelado es terminal y no puede reponer dos veces.

**¿Por qué sesiones en vez de JWT?** Permiten revocación inmediata al cerrar sesión o cambiar permisos. El navegador conserva una cookie HttpOnly; la base guarda solo el hash del token aleatorio.

**¿Cómo se evita CSRF?** Token asociado a la sesión y encabezado obligatorio en escrituras, validación de origen, SameSite=Lax y exigencia de JSON. El login no permite formularios cross-site y valida el Origin cuando lo envía el navegador.

**¿Cómo se evita XSS?** React escapa texto, no se inyecta HTML, se limitan entradas, se validan URLs y Helmet aplica CSP. No se procesan archivos HTML aportados por usuarios.

**¿Cómo se evita escalamiento de privilegios?** Registro con enum minorista/institucional exclusivamente; rutas administrativas protegidas por rol en servidor. Cambiar controles visuales o enviar peticiones manuales no habilita permisos.

**¿Puede un cliente consultar una cotización ajena si adivina su UUID?** No. El filtro de consulta incluye el propietario para clientes institucionales; la respuesta es 404. También se aplica a PDF y decisiones.

**¿Qué es eliminación lógica?** Cambiar `active=false`. El registro y sus referencias históricas permanecen; el catálogo público lo excluye.

**¿Por qué hay JSON en una base normalizada?** Solo para snapshots históricos de cálculo/cliente y versiones auditadas. Las entidades operativas y relaciones están normalizadas. Se acepta duplicación intencional para no alterar evidencia histórica.

**¿Por qué no hay tabla Role o cabecera de carrito?** Los roles son un conjunto cerrado representado por enum PostgreSQL. Existe un solo carrito por usuario, de modo que `CartItem(userId,bookId)` expresa la relación sin una cabecera vacía. La cotización también tiene una sola obra por solicitud, con línea embebida en columnas normales.

**¿Por qué aceptar cotización no descuenta stock?** Puede referirse a impresión bajo demanda o una obra inexistente en catálogo. Se registra un acuerdo comercial; su producción y cobro están fuera del alcance solicitado.

**¿Cómo se verifica la semilla?** Upserts por claves únicas y UUID constantes para muestras. La segunda ejecución no duplica usuarios, libros o pedidos ni vuelve a decrementar inventario.

**¿Qué mejorarían para producción?** HTTPS y credenciales propias, backups y restauración ensayada, observabilidad, límites de consultas grandes, sesiones con limpieza programada, rate limiting compartido si hay varias instancias, índices trigram para catálogo grande y políticas comerciales de entrega/pago. Estas mejoras no se presentan como ya implementadas.
