# Auditoría final de la rúbrica

| Criterio | Máximo | Estado y evidencia | Estimación |
|---|---:|---|---:|
| Arquitectura MVC | 25 | Modelos con persistencia/negocio; controlador HTTP; React y PDF como vistas; sin ORM/SQL en frontend | 25 |
| Motor de descuentos | 20 | 12 pruebas unitarias; límites y Q2318.40 verificado también en API/E2E/PDF | 20 |
| Roles y seguridad | 20 | Cinco accesos, bcrypt, cookies, RBAC, CSRF, Zod; propiedad y revocación comprobadas | 20 |
| Funcionalidad | 15 | RF-01 a RF-05 implementados: 30 pruebas API y cuatro E2E; PostgreSQL y SQL reales | 15 |
| Frontend y adaptación | 10 | Escritorio/tablet/móvil sin overflow; 24 mediciones aisladas inferiores a 2 s; inspección visual | 10 |
| Git, documentación y sustentación | 10 | Repo público y documentos completos; exposición y trabajo de tres integrantes pendientes | 7 |
| Total orientativo | 100 | Evaluación técnica propia, no nota del docente | 97 |

No se afirma 100/100: la calificación definitiva corresponde al docente. La defensa presencial y la colaboración real no pueden reemplazarse por commits inventados.

## Pendientes externos y límites

- Realizar sustentación de diez minutos siguiendo docs/demo-10-minutos.md.
- Acreditar contribuciones auténticas de tres integrantes y sus ramas funcionales.
- Docker Compose: sintaxis comprobada, ejecución pendiente en máquina con motor. No es requisito del PDF; sí alternativa solicitada en la ampliación. Ejecución local plenamente comprobada.
- Bajo pruebas concurrentes se observó un inicio de 2.913 s; sin carga artificial el máximo medido fue 368 ms. Evidencias conservadas, sin ocultar el primer resultado.

## Entregables

README, manual, arquitectura/MVC/ER Mermaid, DDL, DML idempotente, código frontend/backend, semilla de 15 libros y cinco cuentas, pruebas, guion y guía de defensa están versionados. Credenciales demo en README. No hay archivos .env ni datos privados de la base en Git.
