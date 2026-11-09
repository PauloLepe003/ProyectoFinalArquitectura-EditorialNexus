# Resultados reales — 9 noviembre 2026

- Build TypeScript/Vite aprobado.
- 42/42 pruebas aprobadas: 12 unitarias y 30 integración, PostgreSQL nexus_test, 13.36 segundos.
- Suite Playwright: estado final passed, cero fallos. Cuatro escenarios de catálogo/móvil, compra, cotización institucional y administración.
- Migración aplicada a nexus y nexus_test; semilla ejecutada dos veces.
- DDL importado en nexus_sql_verify y DML ejecutado dos veces con ON_ERROR_STOP sin errores.
- npm audit: cero vulnerabilidades; override deepmerge-ts 8.0.0.
- docker compose config --quiet: válido. Contenedores no ejecutados: motor no disponible.
- API PDF verificada. Inspección visual y mediciones completadas en la verificación final descrita abajo.

## Rúbrica orientativa

Estimación final: 97/100, detallada por criterio en docs/auditoria-final.md; no es calificación docente. Evidencia: modelos separados, motor decimal, pruebas reales, diagramas, README, guion y commits. La exposición en vivo y la participación real de tres integrantes no se simulan.


## Verificación final, 9 noviembre 2026

Se repitieron 42/42 pruebas (12.33 s) y 4/4 E2E (19.2 s). Se corrigió la configuración de Playwright: sus archivos van en test-results/e2e para no borrar los reportes de Vitest/PDF.

El PDF de cotización fue descargado, renderizado con Poppler e inspeccionado visualmente: una página legible, sin recortes ni superposición y total Q2318.40. Evidencia reproducible: node scripts/verify-local.mjs.

Rendimiento: 24 mediciones con navegador local, incluyendo 12 públicas en escritorio/tablet/móvil y 12 privadas. Resultado 81–368 ms hasta contenido visible, sin throttling, con servidor y base activos. No representa una garantía para otras máquinas. Una primera ejecución simultánea con tests registró 2913 ms; se conserva en docs/evidence/browser-performance-concurrent.json, junto al resultado aislado en browser-performance.json. API catálogo: media 20 ms, máximo 70 ms en diez consultas.

Los RF-01 a RF-05 no tienen funcionalidad pendiente detectada en la auditoría. Docker no pudo ejecutarse porque el motor está ausente; la alternativa local está iniciada y comprobada. Las pruebas de navegador automatizan acciones reales; no se atribuye una sesión manual humana que no ocurrió. Inspección visual directa de capturas y PDF realizada.
