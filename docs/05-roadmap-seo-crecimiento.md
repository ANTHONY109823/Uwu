# 05 · Roadmap, SEO y Crecimiento

> Cubre entregables: **16. Roadmap de desarrollo · 17. Estrategia de SEO · 18. Estrategia de crecimiento**

---

## 16. Roadmap de desarrollo

Principio: **el flujo core completo y cobrable sale primero**; todo lo demás se apila encima. Cada fase termina con algo desplegado en producción. Fechas relativas al inicio de implementación; hoy es julio 2026 → **el objetivo estratégico es llegar a San Valentín 2027 (14 feb) con la plataforma madura y catálogo amplio**, y a Navidad 2026 con v1 estable.

### Fase 0 — Fundaciones (Semanas 1–2)
- Monorepo Turborepo + pnpm; `packages/config` (ESLint, Prettier, tsconfig strict, preset Tailwind con tokens del DS).
- `apps/web` (Next 15) y `apps/api` (NestJS) esqueleto; docker-compose (pg+redis+minio); Prisma con migración inicial.
- CI (lint+typecheck+test+build), Vercel y Railway conectados, Sentry + PostHog.
- `packages/ui`: Button, Input, Card, Dialog, tokens, modo oscuro, Storybook.
- **Sale a producción**: página "próximamente" con captura de emails (lista de espera = primer activo de marketing).

### Fase 1 — MVP cobrable (Semanas 3–8) 🎯
- Template Registry + **6 plantillas de lanzamiento** (2 free, 4 premium) cubriendo Enamorar, Cumpleaños, Aniversario, Perdón — cada una una experiencia distinta.
- Editor con preview en tiempo real (schema-driven) + autosave anónimo.
- Multimedia v1: fotos (R2 presigned), música por **YouTube + Spotify embed + biblioteca básica**, frases/cartas, corazones, confeti.
- Auth (email + Google), checkout con **MercadoPago + Stripe**, webhooks idempotentes, generación automática de página + slug + QR + email.
- `/d/[slug]` con ISR, OG dinámico, contraseña y expiración.
- Panel cliente v1 (listar, editar, compartir, QR, eliminar) + stats básicas (vistas).
- Landing completa (todas las secciones del brief) + catálogo + precios + FAQ + legal.
- Admin v1: dashboard KPIs, pedidos/pagos, usuarios, plantillas (activar/precio), cupones básicos.
- **Criterio de salida: un desconocido paga y comparte sin ayuda. Lanzamiento beta.**

### Fase 2 — v1.0 pública (Semanas 9–14)
- Catálogo a **15–20 plantillas** (ritmo: 2–3/semana, es el trabajo continuo #1).
- Multimedia completa: upload MP3/WAV/OGG, SoundCloud, TikTok embed, countdown, contador de relación, Google Maps, GIFs, tema claro/oscuro por dedicatoria.
- Stats avanzadas (tiempo de permanencia, orígenes, sparklines) + notificación "fue vista 💌".
- Suscripción **UWU Infinito**; duplicar/renovar; referidos v1.
- Admin: categorías, promociones programadas, blog, SEO module, roles/permisos, audit log completo, backups automatizados.
- PWA; Lighthouse CI como gate; hardening (rate limits afinados, pruebas de webhooks).
- **Lanzamiento público + campaña TikTok. Objetivo Navidad 2026.**

### Fase 3 — Crecimiento (Semanas 15–24, rumbo a San Valentín 2027)
- Catálogo a **50+ plantillas**; colecciones estacionales (Navidad ya en diciembre, San Valentín desde enero).
- Programa de **afiliados** completo con panel propio; música premium; dominios/subdominios personalizados.
- **IA v1**: escritor de cartas + sugeridor de frases (Claude API) — diferenciador de marketing para la campaña de San Valentín.
- Multiidioma listo (es + en) y multimoneda v1 (USD + 2–3 monedas locales).
- Optimización de conversión guiada por PostHog (A/B en landing, precios, editor).

### Fase 4 — Plataforma (Meses 7–12)
- Marketplace de plantillas (revenue share 70/30, review pipeline por PR + admin).
- API pública + white label / multi-tenant (activar el `tenant_id` ya presente).
- Apps móviles (Expo/React Native sobre la misma API) si los datos lo justifican.
- "Modo mágico" IA (dedicatoria completa desde una descripción).

### Gestión
Todo el roadmap se materializa en GitHub Projects ("UWU Roadmap") con milestones por fase e issues etiquetados (`phase:`, `area:`, `prio:`). Ritual semanal: revisar métricas norte (conversión, % compartidas, recompra) → repriorizar.

---

## 17. Estrategia de SEO

La búsqueda del nicho es fuerte y de intención altísima: *"página web romántica para mi novio"*, *"regalo digital aniversario"*, *"carta virtual san valentín"*, *"dedicatoria con música y fotos"*. La competencia SEO es débil (los tipo A son SPAs invisibles para Google — verificado en el análisis competitivo).

### Técnico (desde el MVP — ya diseñado en la arquitectura)
- SSG/ISR para todo lo público → HTML completo para crawlers.
- `sitemap.xml` dinámico (rutas de marketing, categorías, plantillas, blog — **no** las dedicatorias privadas) + `robots.txt` (`/d/` con `noindex` por defecto: privacidad y evitar thin content; opción "permitir en Google" para el usuario que quiera).
- Metadata API de Next: title/description únicos por página, canonical, `hreflang` preparado.
- **Open Graph dinámico por dedicatoria** (`/api/og` con @vercel/og): cuando alguien comparte su página en WhatsApp, la tarjeta muestra "💝 Alguien hizo algo especial para ti" + arte de la plantilla → cada share es un anuncio bien vestido. OG/Twitter Cards también por plantilla y por post del blog.
- JSON-LD: `Organization` + `WebSite` (global), `Product` + `Offer` (detalle de plantilla), `FAQPage` (FAQ), `Article` (blog), `BreadcrumbList` (catálogo).
- Core Web Vitals como gate de CI; imágenes AVIF/WebP; fuentes self-hosted.

### Arquitectura de contenido (los activos que rankean)
1. **Páginas de categoría** (`/plantillas/enamorar`, `/plantillas/cumpleanos`…): title/description/H1 propios + 200–300 palabras editoriales + FAQ propio. Son los landing pages SEO principales — una por cada una de las 15 categorías.
2. **Detalle de plantilla**: nombre descriptivo y rico en intención ("Carta Eterna — carta de amor virtual con música y fotos"), demo indexable.
3. **Blog** (2–4 posts/mes, gestionado desde el admin): intención transaccional disfrazada de contenido — "50 frases para aniversario", "Ideas de regalo virtual para tu novio 2026", "Cómo pedir perdón (y que funcione)". Cada post enlaza a su categoría y CTA al editor.
4. **Estacional con anticipación**: la página "/san-valentin" se publica en diciembre; Google necesita 4–8 semanas para posicionar. Calendario editorial atado a los picos (doc 01 §2.1).

### Medición
Search Console desde el día 0 (verificada vía admin), tracking de posiciones para 20 keywords núcleo, PostHog para atribución orgánico→pago.

---

## 18. Estrategia de crecimiento

### Motor 1 — Viralidad de producto (el principal; costo $0)
- **Cada dedicatoria es un anuncio**: firma "Hecho con UWU 🧸 → crea el tuyo" en planes free/Chispa (removible en Llama: la remoción es un upsell, la presencia es adquisición). Medir: % de destinatarios que clican → K-factor.
- **OG cards irresistibles** al compartir (ver SEO) — el share en WhatsApp es el momento de máximo alcance.
- **El plan gratis existe para esto**: crear gratis → compartir → el destinatario y sus amigos descubren UWU → el creador hace upgrade para quitar marca de agua/añadir música.
- **Loop del destinatario**: al final de la experiencia, "¿Te emocionó? Devuélvele el gesto 💝" → editor con contexto pre-cargado (responderle a quien te dedicó). Convierte receptores en creadores.

### Motor 2 — TikTok/Instagram orgánico (el canal del nicho)
- Formato probado por la competencia: screen-recordings de la reacción + "mira lo que le hice". UWU produce 3–5 clips/semana mostrando plantillas (cada plantilla nueva = contenido nuevo).
- Cuenta de marca + colaboración con micro-influencers de parejas (10k–100k, alto engagement, tarifas bajas en LatAm) sembrando códigos de descuento rastreables.
- CTA siempre a una plantilla concreta, no a la home (menor fricción, mejor atribución).

### Motor 3 — Referidos y afiliados (estructural)
- **Referidos (v1.1)**: doble incentivo — tu amigo recibe 20% off, tú recibes crédito. Visible en el panel y en la pantalla de éxito (momento de máxima emoción = máxima disposición a compartir).
- **Afiliados (v1.2)**: los micro-influencers pasan de colaboración puntual a comisión permanente (25–30% primera compra) con panel propio y pago mensual. Convierte el marketing en canal escalable de costo variable.

### Motor 4 — Retención y recompra
- Las ocasiones son recurrentes por naturaleza: cumpleaños, aniversarios, San Valentín. UWU captura **fechas** (aniversario, cumpleaños del destinatario) y las trabaja: email/push "el cumple de Mariana es en 2 semanas 🎂" con la plantilla sugerida.
- Suscripción UWU Infinito para los heavy users (detectados por 2ª compra → oferta de upgrade con crédito de lo ya pagado).
- Email lifecycle (Resend): carrito/borrador abandonado (el draft anónimo con email capturado en checkout fallido es oro), post-compra (+7 días: "¿cómo reaccionó? cuéntanos"), estacionales.

### Motor 5 — Estacionalidad como campaña
Calendario anual de campañas con landing, colección de plantillas, cupón y contenido propio: San Valentín (la super bowl del negocio — preparación desde diciembre), Día de la Madre/Padre, Amor y Amistad (CO, sept), Navidad. Durante picos: pricing con urgencia suave ("precio especial hasta el 14"), soporte reforzado y freeze de deploys riesgosos la semana crítica.

### Secuencia de lanzamiento
1. **Beta cerrada (fin Fase 1)**: 30–50 usuarios de lista de espera + conocidos; iterar con feedback directo; recolectar testimonios reales (con permiso) para la landing.
2. **Lanzamiento público (Fase 2, ~Navidad 2026)**: campaña TikTok + colección navideña + cupón de lanzamiento.
3. **Campaña San Valentín 2027 (Fase 3)**: el evento para el que se construyó todo — catálogo 50+, IA de cartas como gancho de prensa/contenido, afiliados activados desde enero.

### Métricas norte (revisión semanal)
| Métrica | Definición | Objetivo inicial |
|---|---|---|
| Conversión core | visita a plantilla → pago | ≥ 2% (subiendo con CRO) |
| Coeficiente viral | destinatarios que visitan UWU / dedicatoria vista | ≥ 0.15 |
| Recompra | clientes con 2+ compras en 6 meses | ≥ 20% |
| % compartidas | dedicatorias compartidas ≥1 vez | ≥ 80% |
| CAC pagado | solo cuando se active ads; mientras, $0 | < 1/3 del LTV |
