# Resultados reales — 9 noviembre 2026

- Build TypeScript/Vite aprobado.
- 42/42 pruebas aprobadas: 12 unitarias y 30 integración, PostgreSQL nexus_test, 13.36 segundos.
- Suite Playwright: estado final passed, cero fallos. Cuatro escenarios de catálogo/móvil, compra, cotización institucional y administración.
- Migración aplicada a nexus y nexus_test; semilla ejecutada dos veces.
- DDL importado en nexus_sql_verify y DML ejecutado dos veces con ON_ERROR_STOP sin errores.
- npm audit: cero vulnerabilidades; override deepmerge-ts 8.0.0.
- docker compose config --quiet: válido. Contenedores no ejecutados: motor no disponible.
- API PDF verificada. Pendiente inspección visual del PDF renderizado y medición de carga completa inferior a dos segundos.

## Rúbrica orientativa

MVC 24/25; descuentos 20/20; seguridad 19/20; funcionalidad 14/15; frontend 9/10; Git/documentación/sustentación 7/10. Total estimado 93/100, no calificación docente. Evidencia: modelos separados, motor decimal, pruebas reales, diagramas, README, guion y commits. La exposición en vivo y la participación real de tres integrantes no se simulan.
