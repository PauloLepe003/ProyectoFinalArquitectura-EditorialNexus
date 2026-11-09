# Organización propuesta para tres integrantes

Esta es una propuesta académica de reparto, no una atribución de trabajo ya realizado.

| Integrante | Rama sugerida | Responsabilidades |
|---|---|---|
| Arquitectura / Backend | `feature/modelo-datos-descuentos` | Esquema relacional, migraciones, ORM, motor financiero, transacciones y pruebas unitarias |
| Controladores / Integración | `feature/api-seguridad` | Rutas, validación, sesiones, RBAC, CSRF, pruebas de integración y PDF |
| Frontend / UX / QA | `feature/interfaz-e2e` | Vistas, diseño responsive, accesibilidad, flujos Playwright y documentación de demo |

Contrato de API y decisiones del Modelo deben acordarse antes de integrar. Revisar cambios mediante pull request y ejecutar build/pruebas antes de unir a `main`. Resolver conflictos con participación del dueño de la capa. Las ramas futuras pueden crearse con `git switch -c feature/...`; no se crean ramas ficticias para simular colaboración histórica.

Los commits de esta entrega corresponden a los cambios hechos durante esta sesión. No se inventan fechas, autores humanos ni contribuciones. Publicar el repositorio requiere que el usuario cree el remoto y tenga autenticación disponible; esta sesión no publica a GitHub.
