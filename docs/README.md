# UWU — Documentación de Planificación y Arquitectura

> **UWU · Detalles Románticos** — Plataforma SaaS para crear, personalizar, pagar y compartir páginas web románticas en minutos.

Este directorio contiene los 18 entregables de planificación, generados **antes de escribir código**, tal como exige el proceso del proyecto.

| # | Documento | Entregables cubiertos |
|---|-----------|----------------------|
| 01 | [Análisis de mercado y negocio](01-mercado-y-negocio.md) | 1. Análisis de competencia · 2. Investigación de mercado · 3. Propuesta de valor · 4. Modelo de negocio |
| 02 | [Arquitectura técnica](02-arquitectura.md) | 5. Arquitectura completa · 9. Base de datos · 10. APIs · 13. Estructura de carpetas · 14. Estrategia GitHub + Vercel + Railway |
| 03 | [UX/UI y Design System](03-ux-ui-design-system.md) | 6. UX/UI · 7. Wireframes · 8. Mapa de navegación · 15. Design System |
| 04 | [Paneles de Cliente y Administrador](04-paneles.md) | 11. Panel del administrador · 12. Panel del cliente |
| 05 | [Roadmap, SEO y Crecimiento](05-roadmap-seo-crecimiento.md) | 16. Roadmap de desarrollo · 17. Estrategia SEO · 18. Estrategia de crecimiento |

## Decisiones técnicas clave (resumen ejecutivo)

- **Monorepo Turborepo** con `apps/web` (Next.js 15, App Router) y `apps/api` (NestJS 11). Las plantillas viven en `packages/templates` como componentes React versionados y registrados en un *Template Registry* — esto es lo que permite escalar de 5 a 500 plantillas sin tocar el core.
- **Backend: NestJS** (no ASP.NET Core). Justificación: un solo lenguaje (TypeScript) en todo el stack, tipos compartidos entre front y back vía `packages/shared`, ecosistema npm común, mejor DX con Prisma, y el equipo (tú + Claude) itera más rápido sin cambiar de contexto. ASP.NET Core solo ganaría en cómputo intensivo de CPU, que este producto no tiene.
- **PostgreSQL en Railway + Prisma ORM**, **Redis en Railway** (caché, rate limiting, colas BullMQ).
- **Media en Cloudflare R2** (fotos, audio, video de los usuarios). Railway y Vercel no son almacenamiento de objetos; R2 no cobra egreso, crítico para páginas con música y fotos que se comparten masivamente.
- **Pagos: MercadoPago (LatAm, incluye Yape/Plin vía agregadores) + Stripe (global)** detrás de una abstracción `PaymentProvider` para no casarse con ninguno.
- **Dedicatorias servidas por Next.js ISR** en ruta `u.uwu.app/{slug}` (o `/d/{slug}` pre-dominio propio): generación automática al confirmar pago, sin intervención del administrador.
- **Dominio propio futuro**: toda URL sale de una única variable `NEXT_PUBLIC_APP_URL` / tabla `settings`; migrar dominio = cambiar env vars + DNS, cero cambios de código.

## Regla de oro del proyecto

> Ninguna funcionalidad entra al roadmap de un sprint si rompe el flujo core:
> **elegir plantilla → personalizar → preview en vivo → pagar → página generada → compartir.**
> Ese flujo es el producto. Todo lo demás es amplificación.
