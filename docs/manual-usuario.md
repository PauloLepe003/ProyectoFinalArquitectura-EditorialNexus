# Manual de usuario

## Visitante

Abrir el inicio o Catálogo. Buscar por título, autor, ISBN o editorial; la consulta se envía al servidor tras 300 ms sin escribir. Combinar género, autor, formato y precios. Usar Anterior/Siguiente para recorrer resultados. Abrir un libro para consultar su ficha. El botón de compra dirige al inicio de sesión.

## Registro y perfil

Crear cuenta con nombre, correo y contraseña de al menos diez caracteres. El registro admite minorista o institucional, nunca asesor o administrador. Una institución debe indicar nombre y NIT. Su estado inicial es Pendiente; puede comprar sin el descuento adicional, pero requiere aprobación para solicitar cotizaciones. Mi perfil permite cambiar el nombre. Cerrar sesión revoca la sesión persistida.

## Comprar

1. Iniciar sesión como minorista o institución.
2. Abrir un libro, indicar cantidad y añadir al carrito.
3. Abrir el icono Carrito. Cambiar cantidad y salir del campo para guardar; eliminar con el icono de papelera.
4. Revisar descuentos e IVA. El servidor es la fuente de todos los cálculos.
5. Confirmar pedido y aprobar el diálogo. Se muestra en Mis pedidos con número, fecha, estado, productos, desglose e historial.

Si el inventario cambia durante la compra, se informa stock insuficiente y no se registra una venta parcial. El carrito permanece disponible para corregirlo. No se solicita tarjeta ni se realiza un pago.

## Cliente institucional

En Cotizaciones, pulsar Nueva solicitud. Indicar obra, cantidad, acabado, papel, fecha futura y observaciones. Una vez cotizada, abrir la solicitud y revisar descripción, cantidad final, precio, descuentos, IVA y vigencia. Descargar PDF. Aceptar o rechazar requiere confirmación; una propuesta vencida no puede aceptarse. El historial permite revisar las versiones registradas.

## Asesor

El Panel comercial muestra solicitudes de las instituciones. Abrir una solicitud, evaluar los requisitos y elegir Emitir cotización. Ajustar descripción/cantidad, fijar precio unitario y vigencia. El sistema calcula los importes. Una propuesta sin respuesta se puede revisar, conservando la versión anterior. Rechazar exige motivo. Aceptadas/rechazadas quedan cerradas.

## Administrador

- Resumen: indicadores globales de usuarios, libros activos, pedidos, ventas registradas, solicitudes, cotizaciones e inventario bajo.
- Libros e inventario: crear, buscar y editar metadatos, precio, stock, relaciones, formato y portada; activar/desactivar. Los cambios de stock fijan la existencia actual y se realizan en transacción.
- Autores/Categorías: CRUD con eliminación lógica. Las referencias históricas se mantienen.
- Usuarios: búsqueda por nombre/correo, roles, activación y aprobación/rechazo institucional. El administrador no puede quitarse a sí mismo permisos desde la pantalla. Los cambios revocan las sesiones del usuario afectado.
- Pedidos: filtrar estado, consultar detalles e historial y aplicar transición válida. Cancelación restituye stock una vez. No puede cancelarse un pedido enviado.
- Parámetros: tasa decimal de IVA entre 0 y 1. `0.12` significa 12%. Solo afecta cálculos nuevos.
- Cotizaciones: acceso al mismo panel comercial que los asesores.

Los mensajes de error describen validaciones, permisos y disponibilidad. Los botones de formularios se deshabilitan mientras se procesa una petición. Los diálogos se cierran con Escape y retienen navegación por Tab.
