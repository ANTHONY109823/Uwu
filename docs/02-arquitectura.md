# 02 · Arquitectura Técnica

> Cubre entregables: **5. Arquitectura completa · 9. Base de datos · 10. APIs · 13. Estructura de carpetas y repositorios · 14. Estrategia GitHub + Vercel Pro + Railway Pro**

---

## 5. Arquitectura completa

### 5.1 Vista general

```
                        ┌─────────────────────────────────────────────┐
                        │                  USUARIOS                   │
                        │   comprador · destinatario · admin          │
                        └──────────────┬──────────────────────────────┘
                                       │ HTTPS
                    ┌──────────────────▼───────────────────┐
                    │        VERCEL PRO (Edge/CDN)         │
                    │  apps/web — Next.js 15 (App Router)  │
                    │  · Landing (SSG/ISR)                 │
                    │  · Catálogo (ISR)                    │
                    │  · Editor + Preview (CSR)            │
                    │  · Dedicatorias /d/[slug] (ISR)      │
                    │  · Panel cliente / admin (CSR+RSC)   │
                    └───────┬──────────────────┬───────────┘
                            │ REST/JSON (JWT)  │ webhooks revalidate
                    ┌───────▼──────────────────▼───────────┐
                    │        RAILWAY PRO                   │
                    │  apps/api — NestJS 11                │
                    │  · Auth (JWT + OAuth Google)         │
                    │  · Dedications · Templates · Orders  │
                    │  · Payments (Stripe/MercadoPago)     │
                    │  · Analytics · Admin · Affiliates    │
                    │  · BullMQ workers (QR, email, media) │
                    ├──────────┬──────────┬────────────────┤
                    │ Postgres │  Redis   │                │
                    │ (Railway)│ (Railway)│                │
                    └──────────┴──────────┴────────────────┘
                            │                    │
                ┌───────────▼────────┐  ┌────────▼─────────────┐
                │  Cloudflare R2     │  │  Terceros            │
                │  fotos/audio/video │  │  Stripe · MercadoPago│
                │  (presigned upload)│  │  Resend (email)      │
                └────────────────────┘  │  Sentry · PostHog    │
                                        └──────────────────────┘
```

### 5.2 Decisiones clave y justificación

| Decisión | Elección | Justificación (y alternativa descartada) |
|---|---|---|
| Backend | **NestJS** | Un solo lenguaje en todo el stack → tipos compartidos (`packages/shared`) entre API y web eliminan toda una clase de bugs de contrato; DX superior con Prisma; velocidad de iteración con un equipo de 1 persona + Claude. *ASP.NET Core* solo aporta ventaja en cómputo CPU-bound, inexistente aquí. |
| ORM | **Prisma** | Migraciones declarativas, tipos generados, el estándar de facto con NestJS+Postgres. *TypeORM* descartado por fragilidad histórica de migraciones. |
| Renderizado de dedicatorias | **Next.js ISR en `apps/web`** (NO páginas HTML estáticas generadas por el backend) | Las plantillas son componentes React: heredan Framer Motion, optimización de imágenes, OG tags dinámicos y el design system gratis. `revalidateTag` tras cada edición. Generar HTML plano desde el backend duplicaría el sistema de plantillas y perdería todo el stack visual. |
| Media storage | **Cloudflare R2** | Egreso gratuito (las dedicatorias con fotos/música se abren cientos de veces); API S3-compatible; presigned URLs = el archivo nunca pasa por nuestro backend. *Vercel Blob* descartado por costo de egreso; *filesystem de Railway* descartado por ser efímero. |
| Pagos | **Abstracción `PaymentProvider`** con adaptadores Stripe + MercadoPago | LatAm no se cubre solo con Stripe (Perú necesita Yape/Plin vía MercadoPago/Culqi; México usa OXXO/SPEI vía MercadoPago). La abstracción permite añadir proveedores sin tocar el dominio. |
| Auth | **JWT emitido por la API** (access 15min + refresh httpOnly cookie) + OAuth Google como estrategia de NestJS | Una sola fuente de verdad de identidad (la API), consumible mañana por apps móviles y API pública. *NextAuth como emisor* descartado: acoplaría la identidad al frontend. |
| Colas | **BullMQ sobre Redis** | Generación de QR, emails transaccionales, procesamiento de imágenes (thumbnails/compresión), limpieza de enlaces expirados. Desacopla el checkout de todo lo lento. |
| API style | **REST/JSON + OpenAPI (Swagger)** | Contrato explícito, base directa de la futura API pública. *GraphQL* descartado: sobreingeniería para este dominio. |
| Multi-tenant / White label | **Diseño "tenant-ready"**: columna `tenant_id` en tablas de negocio desde el día 1, con un único tenant por ahora | Costo hoy: casi cero. Costo de retrofit futuro: enorme. |

### 5.3 El sistema de plantillas (el corazón del producto)

Escalar a 50–500 plantillas **realmente distintas** exige que una plantilla sea una unidad autocontenida y declarativa:

```
packages/templates/
  registry.ts                    ← registro central: id → módulo (lazy)
  src/
    carta-eterna/
      index.tsx                  ← componente React de la experiencia
      schema.ts                  ← Zod: qué campos personaliza el usuario
      manifest.ts                ← metadata: nombre, categorías, tier (free/premium),
      │                             precio override, features soportadas, versión
      preview.jpg / demo.mp4     ← assets del catálogo
    netflix-de-nuestro-amor/
    constelacion/
    ...
```

- **`schema.ts` (Zod)** define los campos editables → el **editor se autogenera** a partir del schema (texto, fotos, música, colores, secciones). Añadir una plantilla nueva NO requiere tocar el editor.
- **`manifest.ts`** declara qué *features* soporta (música, countdown, mapa, contraseña, galería…) → el editor muestra solo lo aplicable.
- El **preview en tiempo real** renderiza el mismo componente de la plantilla dentro de un marco de teléfono, alimentado por el estado del editor (misma código-fuente que la página final: fidelidad 1:1 garantizada por construcción).
- La fila `templates` en BD es un espejo del manifest (sincronizada por script en CI) para poder consultarla, categorizarla y venderla desde la API.
- **Versionado**: la dedicatoria guarda `template_version`; una plantilla puede evolucionar sin romper páginas ya vendidas.

### 5.4 Flujo automático de compra (cero intervención humana)

```
1. Editor guarda borrador (draft) → POST /dedications (status: DRAFT)
2. Checkout → POST /orders → la API crea Order + preference/session del proveedor de pago
3. Usuario paga en Stripe Checkout / MercadoPago
4. Webhook payment.succeeded → API (verificación de firma, idempotente):
   a. Order → PAID
   b. Dedication → PUBLISHED, se asigna slug único (nanoid legible)
   c. BullMQ: generar QR (PNG/SVG a R2), enviar email con enlace + QR
   d. POST a Vercel: revalidate del tag `dedication:{slug}`
5. Redirect a /success → enlace, QR y botones de compartir (WhatsApp/IG/TikTok/copiar)
```

Idempotencia por `event_id` del webhook (tabla `webhook_events`), porque los proveedores reintentan.

### 5.5 Seguridad (mapa de requisitos → implementación)

| Requisito | Implementación |
|---|---|
| HTTPS | Forzado por Vercel y Railway; HSTS |
| JWT | Access token 15 min + refresh rotativo en cookie `httpOnly SameSite=Lax`; revocación vía Redis denylist |
| OAuth | Google (passport strategy en NestJS); Apple/Facebook post-MVP |
| XSS | React escapa por defecto; sanitización server-side (DOMPurify) de todo texto de usuario que se renderice; CSP estricta en `next.config` |
| CSRF | Mutaciones solo con `Authorization: Bearer` (no cookies para la API) → CSRF neutralizado por diseño; cookies de refresh con `SameSite` |
| SQL Injection | Prisma parametriza todo; prohibido `$queryRawUnsafe` por regla de ESLint |
| Rate limiting | `@nestjs/throttler` + Redis: global, y agresivo en auth/checkout/upload; rate limit por IP en vistas de dedicatorias para estadísticas honestas |
| Uploads | Presigned URLs con límite de tamaño y content-type validado; escaneo de dimensiones/duración en worker |
| Contraseña de dedicatoria | Hash (argon2) — nunca en claro; verificación server-side, el contenido protegido no viaja al cliente sin pasarla |
| Logs | Pino estructurado → Railway logs + Sentry para errores; auditoría de acciones admin en tabla `audit_logs` |
| Backups | PITR de Railway Postgres + `pg_dump` diario a R2 vía GitHub Action programada |
| Secretos | Vercel/Railway env vars; nunca en repo; rotación documentada |

### 5.6 Rendimiento

- **Landing/catálogo**: SSG + ISR, imágenes AVIF/WebP con `next/image`, fuentes self-hosted con `next/font`.
- **Dedicatorias**: ISR con caché en edge de Vercel → TTFB global <100ms; media desde R2 con caché inmutable.
- **Editor**: code-splitting por plantilla (import dinámico desde el registry) — el usuario solo descarga la plantilla que edita.
- **Core Web Vitals** como gate de CI (Lighthouse CI en GitHub Actions, presupuesto: LCP <2.5s móvil 4G).
- **Partículas/corazones**: canvas con `requestAnimationFrame`, pausadas fuera de viewport y con `prefers-reduced-motion`.

### 5.7 Preparado para escalar

- **PWA**: manifest + service worker (next-pwa) en v1.x — instala "UWU" en el teléfono.
- **Móvil nativo**: la API REST + JWT ya es el backend de una futura app React Native/Expo.
- **API pública**: los mismos controladores NestJS expuestos bajo `/v1/public` con API keys.
- **Multiidioma**: `next-intl` con namespaces desde el MVP (aunque solo exista `es`); textos de plantillas nunca hardcodeados.
- **Multimoneda**: precios en tabla `prices` (money como enteros en centavos + currency), nunca constantes en código.
- **Multi-tenant / White label**: `tenant_id` presente desde el día 1 (ver 5.2).

### 5.8 Funciones de IA (diseño futuro, v2)

Módulo `apps/api/src/modules/ai` con proveedor Claude API:
1. **Escritor de cartas**: el usuario da 4 datos (nombre, ocasión, tono, anécdota) → carta personalizada editable.
2. **Sugeridor de frases** contextual por categoría dentro del editor.
3. **"Modo mágico"**: describir la relación en un párrafo → UWU elige plantilla, redacta textos y sugiere música (dedicatoria completa en 1 paso).
4. **Música inteligente**: mapear tono emocional → biblioteca musical.
5. **Mejora de imágenes**: recorte inteligente y filtros automáticos en el worker de media.
6. **Asistente**: chat de soporte entrenado con FAQ + estado del pedido.
Guardarraíles: moderación de contenido generado, límites de uso por plan, caché de generaciones.

---

## 9. Base de datos (PostgreSQL · Prisma)

### 9.1 Diagrama entidad-relación (esencial)

```
users ──< dedications >── templates >──< template_categories >── categories
  │            │  │
  │            │  └──< dedication_assets (fotos/audio/video en R2)
  │            └──< dedication_events (vistas, shares — particionable)
  ├──< orders ──< order_items
  │       └──< payments (1 order : n intentos)
  ├──< subscriptions
  ├──< referrals / affiliate_accounts ──< affiliate_conversions
  └──< audit_logs (solo admin)
coupons ──< coupon_redemptions
webhook_events · settings · blog_posts · music_library
```

### 9.2 Esquema (Prisma, resumen de campos críticos)

```prisma
model User {
  id            String   @id @default(cuid())
  tenantId      String   @default("uwu")          // tenant-ready
  email         String   @unique
  passwordHash  String?                            // null si OAuth-only
  name          String
  role          Role     @default(CUSTOMER)        // CUSTOMER | ADMIN | SUPPORT | DESIGNER
  locale        String   @default("es")
  createdAt     DateTime @default(now())
  // relaciones: dedications, orders, subscriptions, affiliateAccount...
}

model Template {
  id           String   @id                        // = id del manifest en packages/templates
  slug         String   @unique
  name         String
  tier         Tier                                // FREE | PREMIUM | SPECIAL
  priceCents   Int?                                // override del precio del plan
  currency     String   @default("USD")
  features     Json                                // espejo del manifest
  version      Int
  status       TemplateStatus                      // DRAFT | ACTIVE | RETIRED
  categories   TemplateCategory[]
}

model Dedication {
  id              String   @id @default(cuid())
  slug            String?  @unique                 // asignado al publicar (nanoid)
  userId          String
  templateId      String
  templateVersion Int
  title           String
  content         Json                             // valores validados contra el schema Zod
  passwordHash    String?
  status          DedicationStatus                 // DRAFT | PUBLISHED | EXPIRED | DISABLED
  expiresAt       DateTime?                        // null = de por vida
  publishedAt     DateTime?
  viewCount       Int      @default(0)             // desnormalizado; detalle en dedication_events
  @@index([userId, status])
}

model Order {
  id           String   @id @default(cuid())
  userId       String
  status       OrderStatus                          // PENDING | PAID | FAILED | REFUNDED
  totalCents   Int
  currency     String
  couponId     String?
  affiliateId  String?                              // atribución
  items        OrderItem[]                          // dedicatoria, plantilla, addon música, dominio…
  payments     Payment[]
}

model Payment {
  id           String   @id @default(cuid())
  orderId      String
  provider     String                               // 'stripe' | 'mercadopago'
  providerRef  String   @unique                     // session/preference id
  status       PaymentStatus
  rawPayload   Json                                 // último webhook, para debugging
}

model WebhookEvent {                                 // idempotencia
  id        String   @id                             // event id del proveedor
  provider  String
  processedAt DateTime @default(now())
}

model DedicationEvent {                              // analytics propia
  id           BigInt   @id @default(autoincrement())
  dedicationId String
  type         String                               // VIEW | SHARE | UNLOCK
  visitorHash  String                               // hash(ip+ua) diario — sin PII
  durationSec  Int?
  createdAt    DateTime @default(now())
  @@index([dedicationId, createdAt])
}
```

(Modelos completos de `Subscription`, `Coupon`, `AffiliateAccount`, `MusicTrack`, `BlogPost`, `AuditLog`, `Setting` siguen el mismo patrón; se detallan al iniciar la implementación del módulo correspondiente.)

### 9.3 Reglas de datos

- **Dinero siempre en centavos (Int) + currency** — nunca floats.
- **`content` de la dedicatoria es Json validado por el schema Zod de su plantilla** en la API antes de persistir: flexibilidad de 500 plantillas distintas sin 500 tablas.
- **Soft-delete** (`deletedAt`) en `users` y `dedications` (los enlaces pagados no deben romperse por accidente).
- **`dedication_events`** es la tabla de mayor volumen: índice por `(dedicationId, createdAt)`, agregados diarios materializados para el panel, particionado por rango cuando el volumen lo pida.

---

## 10. APIs (REST · OpenAPI)

Prefijo `/v1`. JWT Bearer salvo rutas públicas (🌐). Paginación por cursor. Errores RFC 7807.

### Auth
```
POST   /v1/auth/register            🌐 email+password
POST   /v1/auth/login               🌐
POST   /v1/auth/refresh             🌐 (cookie)
POST   /v1/auth/logout
GET    /v1/auth/google | /google/callback  🌐
GET    /v1/me · PATCH /v1/me
```

### Catálogo
```
GET    /v1/templates                🌐 ?category=&tier=&search=&cursor=
GET    /v1/templates/:slug          🌐
GET    /v1/categories               🌐
GET    /v1/music                    🌐 biblioteca (
```

### Dedicatorias
```
POST   /v1/dedications              crear draft
GET    /v1/dedications              mis dedicatorias
GET    /v1/dedications/:id
PATCH  /v1/dedications/:id          editar (valida contra schema Zod de la plantilla)
POST   /v1/dedications/:id/duplicate
DELETE /v1/dedications/:id
POST   /v1/dedications/:id/renew    renovar enlace/expiración
GET    /v1/dedications/:id/stats    vistas, tiempo, shares (agregados)
GET    /v1/dedications/:id/qr       descarga QR (png|svg)
POST   /v1/uploads/presign          presigned URL a R2 (valida tipo/tamaño/cuota del plan)
```

### Público (consumido por la página de la dedicatoria vía RSC)
```
GET    /v1/public/dedications/:slug 🌐 contenido publicado (sin campos protegidos)
POST   /v1/public/dedications/:slug/unlock  🌐 verifica contraseña → contenido completo
POST   /v1/public/dedications/:slug/events  🌐 registra VIEW/SHARE (rate-limited)
```

### Checkout y facturación
```
POST   /v1/orders                   crea orden + sesión de pago  { items, couponCode?, provider }
GET    /v1/orders/:id
POST   /v1/coupons/validate         🌐
POST   /v1/webhooks/stripe          🌐 firma verificada
POST   /v1/webhooks/mercadopago     🌐 firma verificada
POST   /v1/subscriptions · DELETE /v1/subscriptions/:id
```

### Admin (`role: ADMIN`, guard + audit log en cada mutación)
```
GET    /v1/admin/dashboard          KPIs
CRUD   /v1/admin/users · /templates · /categories · /coupons · /promotions
GET    /v1/admin/orders · /payments
CRUD   /v1/admin/blog · /music
GET    /v1/admin/analytics · /logs
GET/PUT /v1/admin/settings          (SEO defaults, feature flags, textos legales)
POST   /v1/admin/backups/trigger
CRUD   /v1/admin/affiliates         aprobación, comisiones, payouts
```

---

## 13. Estructura de carpetas y repositorios

**Un monorepo** (`uwu`) con Turborepo + pnpm. Justificación: tipos compartidos front/back, PRs atómicos que tocan plantilla+API+web, un solo pipeline. Dos repos solo tendría sentido con equipos separados — no es el caso.

```
uwu/
├── apps/
│   ├── web/                        # Next.js 15 (Vercel)
│   │   ├── app/
│   │   │   ├── (marketing)/        # landing, precios, blog, faq  → SSG/ISR
│   │   │   ├── (catalog)/plantillas/[categoria]/[slug]
│   │   │   ├── (editor)/crear/[templateSlug]/
│   │   │   ├── (checkout)/pagar/ · exito/
│   │   │   ├── d/[slug]/           # LA dedicatoria → ISR + revalidateTag
│   │   │   ├── (dashboard)/panel/  # cliente
│   │   │   ├── (admin)/admin/
│   │   │   └── api/                # solo route handlers de soporte (og-image, revalidate)
│   │   ├── components/ · lib/ · styles/
│   │   └── next.config.ts
│   ├── api/                        # NestJS 11 (Railway)
│   │   ├── src/
│   │   │   ├── modules/            # auth, users, templates, dedications, orders,
│   │   │   │                       # payments, uploads, analytics, coupons,
│   │   │   │                       # affiliates, admin, blog, ai (futuro)
│   │   │   ├── common/             # guards, pipes, filters, decorators
│   │   │   ├── infra/              # prisma, redis, r2, mail, queue
│   │   │   └── main.ts
│   │   ├── prisma/schema.prisma · migrations/
│   │   ├── test/
│   │   └── Dockerfile
├── packages/
│   ├── templates/                  # ⭐ registry + 50..N plantillas (ver 5.3)
│   ├── ui/                         # design system: componentes shadcn extendidos + motion
│   ├── shared/                     # tipos, DTOs Zod, constantes (contrato API↔web)
│   └── config/                     # eslint, tsconfig, tailwind preset, prettier
├── docs/                           # esta documentación
├── .github/workflows/              # ci.yml, deploy-api.yml, lighthouse.yml, backup.yml
├── docker-compose.yml              # dev: postgres + redis + minio (S3 local)
├── turbo.json · pnpm-workspace.yaml
└── CLAUDE.md                       # convenciones para el asistente
```

**Docker**: `docker-compose.yml` levanta Postgres+Redis+MinIO para desarrollo (paridad con producción); `apps/api/Dockerfile` multi-stage (build → runtime node:22-slim) es lo que despliega Railway. `apps/web` no usa Docker: Vercel construye nativo.

---

## 14. Estrategia GitHub + Vercel Pro + Railway Pro

### Git y ramas
- **Trunk-based**: `main` siempre desplegable. Ramas cortas `feat/…`, `fix/…`, `chore/…` → PR → squash merge.
- Conventional Commits (valida commitlint en CI) → changelog automático.
- Protección de `main`: CI verde + 1 review (auto-review con Claude via `/code-review` al ser equipo de 1).

### GitHub Projects e Issues
- Un Project **"UWU Roadmap"** (vista board por fase + vista tabla por módulo).
- Labels: `phase:mvp|v1|v2`, `area:web|api|templates|infra`, `type:feat|bug|chore`, `prio:p0..p2`.
- Issue templates: feature, bug, **nueva plantilla** (checklist: schema, manifest, preview, demo, QA móvil).

### CI/CD (GitHub Actions)
```
PR:    lint + typecheck + test + build (turbo, con cache remota)  → gate de merge
       Vercel Preview Deployment automático (URL por PR)
       Railway PR environment (API efímera) para cambios de apps/api
main:  deploy automático:
       · Vercel Pro → producción web (instantáneo, rollback en 1 click)
       · Railway Pro → build Dockerfile → migraciones Prisma (`migrate deploy`
         como paso pre-deploy) → producción API
Nightly: backup pg_dump → R2 · Lighthouse CI sobre producción
```

### Entornos y configuración
| Entorno | Web | API/DB |
|---|---|---|
| dev | `next dev` local | docker-compose (pg+redis+minio) |
| preview | Vercel Preview por PR | Railway PR env (DB efímera con seed) |
| prod | Vercel Pro | Railway Pro (Postgres + Redis + API) |

- Toda URL absoluta sale de `NEXT_PUBLIC_APP_URL` / `API_URL` → **migrar al dominio propio = actualizar env vars + añadir dominio en Vercel/Railway + 301 desde los dominios antiguos**. Cero código.
- Secretos solo en Vercel/Railway; `.env.example` versionado y completo.

### Observabilidad
- **Sentry** (web + api, sourcemaps por release en CI) · **PostHog** (producto: funnels del flujo core) · Railway metrics + alertas de uso · UptimeRobot sobre `/health`.
