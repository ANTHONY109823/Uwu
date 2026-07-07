# 📘 UWU — Software Blueprint (Documento Técnico de Desarrollo)

**Versión:** 0.1.0 · **Estado:** Borrador activo · **Páginas estimadas:** ~80

---

## Tabla de contenidos

1. [Introducción](#1-introducción)
2. [Arquitectura](#2-arquitectura)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Arquitectura del sistema](#4-arquitectura-del-sistema)
5. [Flujo general](#5-flujo-general)
6. [Reglas del negocio](#6-reglas-del-negocio)
7. [Módulos](#7-módulos)
8. [Base de datos](#8-base-de-datos)
9. [API](#9-api)
10. [Panel administrador](#10-panel-administrador)
11. [Plantillas](#11-plantillas)
12. [Sistema de pagos](#12-sistema-de-pagos)
13. [Seguridad](#13-seguridad)
14. [Diseño](#14-diseño)
15. [Convenciones](#15-convenciones)
16. [Roadmap](#16-roadmap)
17. [Reglas de desarrollo](#17-reglas-de-desarrollo)

---

## 1. Introducción

### 1.1 Objetivo del proyecto

UWU es una plataforma SaaS que permite crear, personalizar, pagar y compartir **páginas web románticas** (dedicatorias digitales) en minutos. El usuario elige una plantilla, personaliza textos/fotos/música, paga (o usa plantillas gratis) y recibe un enlace compartible + HTML descargable.

### 1.2 Alcance

| Incluido | Excluido (v1.0) |
|----------|-----------------|
| Catálogo por categorías y niveles | App móvil nativa |
| Editor web con vista previa | Marketplace de terceros |
| Pagos Mercado Pago (PEN/USD) | Suscripciones recurrentes |
| Generación y hosting de dedicatorias | Video llamadas / chat |
| Panel administrador | Multi-tenant B2B |
| Compartir WhatsApp, QR, redes | |

### 1.3 Tecnologías

| Capa | Tecnología | Hosting |
|------|------------|---------|
| Frontend | Next.js 15 + React 19 + TypeScript | Vercel Pro |
| UI | Tailwind CSS + Shadcn UI + Framer Motion | — |
| Backend | NestJS + TypeScript | Railway Pro |
| Base de datos | PostgreSQL 16 | Railway Pro |
| Contenedores | Docker + Docker Compose | Railway / local |
| Pagos | Mercado Pago API | — |
| CI/CD | GitHub Actions | GitHub |
| Repositorio | GitHub (monorepo) | — |

### 1.4 Restricciones

- **Presupuesto inicial:** infraestructura mínima viable (Vercel Hobby → Pro, Railway Starter → Pro).
- **Mercado primario:** Perú (PEN), secundario LATAM/USA (USD).
- **Idioma:** español (i18n en v2.0).
- **Rendimiento:** LCP < 2.5s en landing, TTI < 3s en editor.
- **Compatibilidad:** Chrome 100+, Safari 15+, Firefox 100+, móvil iOS/Android.

### 1.5 Principios del desarrollo

1. **Mobile-first** — el 70% del tráfico será móvil.
2. **Plantillas independientes** — cada plantilla es un módulo autocontenido.
3. **Backend como fuente de verdad** — precios, permisos y pagos solo en servidor.
4. **Progressive enhancement** — MVP actual en GitHub Pages sigue funcionando durante migración.
5. **Documentar antes de implementar** — cada módulo nuevo actualiza este blueprint.

---

## 2. Arquitectura

### 2.1 Stack tecnológico

```
┌──────────────┐     HTTPS      ┌──────────────┐     REST      ┌──────────────┐
│   Cliente    │ ──────────────▶│   Vercel     │──────────────▶│   Railway    │
│  (Browser)   │◀──────────────│  Next.js     │◀──────────────│   NestJS     │
└──────────────┘                └──────────────┘               └──────┬───────┘
                                                                      │
                                                              ┌───────▼───────┐
                                                              │  PostgreSQL   │
                                                              └───────────────┘
```

### 2.2 Comunicación entre capas

- **Frontend → Backend:** REST JSON sobre HTTPS. JWT en header `Authorization: Bearer`.
- **Backend → PostgreSQL:** Prisma ORM (recomendado) o TypeORM.
- **Mercado Pago → Backend:** Webhooks POST firmados.
- **Frontend → CDN:** assets estáticos de plantillas en `/public/templates/` o S3.

### 2.3 Entornos

| Entorno | Frontend | Backend | BD |
|---------|----------|---------|-----|
| `development` | localhost:3000 | localhost:4000 | Docker local |
| `staging` | staging.uwu.app | api-staging.uwu.app | Railway staging |
| `production` | uwu.app | api.uwu.app | Railway production |

---

## 3. Estructura de carpetas

```
uwu/
│
├── frontend/                 # Next.js — landing, catálogo, editor, checkout
│   ├── app/
│   │   ├── (public)/         # Rutas públicas
│   │   ├── (editor)/         # Editor de dedicatorias
│   │   └── api/              # Route handlers ligeros (proxy, OG)
│   ├── components/
│   │   ├── ui/               # Shadcn UI
│   │   ├── catalog/
│   │   ├── editor/
│   │   └── shared/
│   ├── lib/
│   ├── hooks/
│   └── public/
│
├── backend/                  # NestJS — API, webhooks, generador
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── dedications/
│   │   │   ├── payments/
│   │   │   ├── generator/
│   │   │   ├── admin/
│   │   │   └── analytics/
│   │   ├── common/
│   │   └── main.ts
│   └── prisma/
│
├── admin/                    # Panel admin (puede ser ruta /admin en frontend)
│
├── templates/                # Plantillas HTML/JS independientes
│   ├── _base/                # Layout base compartido
│   ├── hello-kitty/
│   ├── carta-eterna/
│   └── ...
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
│
├── docs/                     # Sitio estático actual (GitHub Pages — legacy)
│
├── blueprint/                # ← ESTE DOCUMENTO
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
│
└── scripts/
    ├── deploy.sh
    ├── seed-catalog.ts
    └── generate-template.ts
```

---

## 4. Arquitectura del sistema

Ver diagramas detallados en:
- [diagramas/c4-arquitectura.md](./diagramas/c4-arquitectura.md)
- [diagramas/erd.md](./diagramas/erd.md)
- [diagramas/flujo-usuario.md](./diagramas/flujo-usuario.md)
- [diagramas/flujo-pagos.md](./diagramas/flujo-pagos.md)

### 4.1 Contenedores (C4 Nivel 2)

| Contenedor | Responsabilidad |
|------------|-----------------|
| **Web App** | Landing, catálogo, editor, checkout, vista previa |
| **API Server** | Lógica de negocio, auth, pagos, generación |
| **PostgreSQL** | Persistencia relacional |
| **Mercado Pago** | Procesamiento de pagos |
| **GitHub** | Código fuente + CI/CD |

### 4.2 Generador HTML

El módulo `generator` del backend:

1. Recibe datos de dedicatoria (JSON).
2. Carga plantilla desde `templates/{slug}/`.
3. Reemplaza placeholders (`__UWU_MSG__`, `__UWU_PARA__`, etc.).
4. Inyecta assets (imágenes subidas → URLs firmadas).
5. Guarda HTML en storage + registra URL pública.
6. Retorna `{ slug, url, accessCode, htmlPath }`.

---

## 5. Flujo general

```
Inicio (Landing)
      ↓
Categorías (Amor, Cumpleaños, Perdón…)
      ↓
Nivel (🆓 Gratis · 💌 Premium · 💎 Exclusiva)
      ↓
Plantilla (tarjeta con demo + precio)
      ↓
Editor (nombre, mensaje, fotos, música)
      ↓
Vista previa (iframe en tiempo real)
      ↓
Pago (Mercado Pago) — omitido si Gratis
      ↓
Webhook (confirmación de pago)
      ↓
Generación (HTML + slug + código acceso)
      ↓
Compartir (WhatsApp, QR, copiar enlace, descargar HTML)
```

### 5.1 Flujo alternativo — Gratis

Gratis omite Pago y Webhook. Tras Editor → Vista previa → clic en "Obtener gratis" → Generación directa.

### 5.2 Flujo alternativo — Edición posterior

Usuario ingresa código de acceso → Backend valida → Editor pre-cargado → Guardar (sin nuevo pago si dentro de ventana de edición: 30 días).

---

## 6. Reglas del negocio

### 6.1 Categorías

| ID | Nombre | Slug | Descripción |
|----|--------|------|-------------|
| 1 | Amor | `amor` | Declaraciones románticas generales |
| 2 | Romántica | `romantica` | Cartas, poemas, gestos íntimos |
| 3 | Cumpleaños | `cumpleanos` | Celebraciones con velitas, globos |
| 4 | Aniversario | `aniversario` | Tiempo juntos, líneas de tiempo |
| 5 | Perdón | `perdon` | Disculpas sinceras |
| 6 | Extrañar | `extranar` | Distancia, nostalgia |
| 7 | Familia | `familia` | Mamá, papá, hermanos |
| 8 | Mascotas | `mascotas` | Homenajes a mascotas |
| 9 | Sorprender | `sorprender` | Sorpresas inesperadas |
| 10 | Fechas especiales | `fechas-especiales` | Navidad, Año Nuevo, San Valentín |
| 11 | Cerrar ciclos | `cerrar-ciclos` | Despedidas amorosas |
| 12 | Pedida de mano | `pedida` | Propuestas de matrimonio |

> **Mapeo MVP actual:** las categorías en `uwu.js` (`cat` field) se migrarán a esta tabla normalizada.

### 6.2 Niveles (tiers)

| Nivel | Código | Precio PEN | Precio USD | Incluye |
|-------|--------|------------|------------|---------|
| 🆓 Gratis | `free` | S/ 0 | $0 | Marca UWU visible, plantillas básicas, compartir |
| 💌 Premium | `premium` | S/ 5.00 | $1.49 | Sin marca, más assets, animaciones |
| 💎 Exclusiva | `exclusive` | S/ 8.00 | $2.49 | Plantillas únicas, efectos avanzados, prioridad |

> **Nota migración:** el MVP actual usa precios variables (S/ 19.90–35.90). La v1.0 unifica a tiers fijos según estrategia de volumen. Plantillas legacy mantienen precio histórico hasta migración.

### 6.3 Códigos de plantilla

Formato: `UWU-XXXX` (4 caracteres alfanuméricos).

Ejemplos actuales: `UWU-HKIT`, `UWU-CTRN`, `UWU-FIIN`, `UWU-LGPREG`.

### 6.4 Códigos de acceso (dedicatoria)

Formato: `UWU-XXXX-XXXX` (2 grupos de 4, sin caracteres ambiguos: 0/O, 1/I/L).

Generados server-side con `crypto.randomBytes`. Únicos en BD con índice UNIQUE.

### 6.5 Reglas de pago

- Pago exitoso → estado `paid` → generación automática.
- Pago pendiente → estado `pending` → sin generación.
- Pago fallido → estado `failed` → usuario puede reintentar (misma orden, 24h).
- Gratis → estado `free` → generación inmediata.

### 6.6 Reglas de contenido

- Mensaje máximo: 2.000 caracteres.
- Nombre (para/de): máximo 50 caracteres.
- Imágenes: máx. 10 por dedicatoria, 5 MB c/u, formatos JPG/PNG/WebP.
- Música: URL YouTube/Spotify o archivo MP3 (máx. 10 MB).

### 6.7 Marca UWU en Gratis

Plantillas `free` muestran footer obligatorio:

```html
<div class="uwu-brand">Hecho con UWU 🧸 · uwu.app</div>
```

No removible en frontend. Backend valida presencia al generar.

---

## 7. Módulos

### 7.1 Landing

**Ruta:** `/`  
**Funciones:** hero, showcase, catálogo, testimonios, FAQ, CTA, selector moneda.  
**Componentes:** `Hero`, `ShowcaseGrid`, `CatalogCarousel`, `CurrencyToggle`, `FAQ`, `Footer`.  
**API:** `GET /api/categories`, `GET /api/templates?featured=true`.

### 7.2 Catálogo

**Ruta:** `/catalogo`, `/catalogo/[categoria]`, `/catalogo/[categoria]/[nivel]`  
**Funciones:** filtrar por categoría, nivel, búsqueda; ordenar por popularidad/precio.  
**Componentes:** `TemplateCard`, `CategoryPill`, `LevelBadge`, `FilterBar`, `SearchInput`.  
**API:** `GET /api/templates`, `GET /api/categories`.

### 7.3 Editor

**Ruta:** `/editor/[templateSlug]`  
**Funciones:** formulario dinámico según plantilla, upload fotos, selector música, vista previa live.  
**Componentes:** `EditorForm`, `PhotoUploader`, `MusicPicker`, `PreviewFrame`, `SaveBar`.  
**API:** `POST /api/dedications/draft`, `PUT /api/dedications/:id`, `POST /api/upload`.

### 7.4 Vista previa

**Ruta:** `/preview/[draftId]` o iframe dentro del editor.  
**Funciones:** renderizar plantilla con datos del usuario sin persistir definitivamente.  
**Implementación:** iframe → `GET /api/dedications/:id/preview`.

### 7.5 Pagos

**Ruta:** `/checkout/[draftId]`  
**Funciones:** resumen, selección método MP, redirección checkout MP.  
**API:** `POST /api/payments/create`, webhook `POST /api/payments/webhook`.

### 7.6 Generador

**Backend interno** — no expuesto directamente al usuario.  
**Trigger:** webhook pago exitoso o solicitud gratis.  
**Output:** HTML estático, slug público, código acceso.

### 7.7 Compartir

**Ruta:** `/d/[slug]` (dedicatoria pública)  
**Funciones:** ver dedicatoria, botones WhatsApp/Facebook/X, QR, copiar enlace, descargar HTML.  
**API:** `GET /api/dedications/:slug`, `GET /api/dedications/:slug/qr`.

### 7.8 Centro de gestión (usuario)

**Ruta:** `/mis-dedicatorias` (acceso por código)  
**Funciones:** listar, editar, eliminar, renovar (nuevo pago si expiró).  
**API:** `GET /api/dedications/by-code/:code`, `PUT`, `DELETE`.

### 7.9 Administrador

**Ruta:** `/admin/*` (protegido JWT)  
Ver [sección 10](#10-panel-administrador).

---

## 8. Base de datos

Esquema completo en [database/schema.sql](./database/schema.sql) y [diagramas/erd.md](./diagramas/erd.md).

### 8.1 Tablas principales

| Tabla | Propósito |
|-------|-----------|
| `categories` | Categorías del catálogo |
| `levels` | Niveles: free, premium, exclusive |
| `templates` | Plantillas con metadata, precio, assets |
| `template_fields` | Campos configurables por plantilla |
| `users_temp` | Usuarios anónimos (email opcional, código) |
| `orders` | Órdenes de compra |
| `payments` | Transacciones Mercado Pago |
| `dedications` | Dedicatorias generadas |
| `dedication_images` | Imágenes subidas |
| `dedication_music` | Referencias música |
| `visits` | Analytics de visitas |
| `admin_users` | Usuarios administrador |
| `audit_logs` | Logs de acciones admin |
| `settings` | Configuración global (precios, feature flags) |

### 8.2 Índices críticos

```sql
CREATE UNIQUE INDEX idx_dedications_slug ON dedications(slug);
CREATE UNIQUE INDEX idx_dedications_access_code ON dedications(access_code);
CREATE INDEX idx_dedications_template_id ON dedications(template_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_mp_id ON payments(mercadopago_id);
CREATE INDEX idx_visits_dedication_id ON visits(dedication_id);
```

---

## 9. API

Referencia completa en [api/endpoints.md](./api/endpoints.md).

### 9.1 Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/categories` | — | Listar categorías |
| GET | `/api/templates` | — | Listar plantillas (filtros) |
| GET | `/api/templates/:slug` | — | Detalle plantilla |
| POST | `/api/dedications/draft` | — | Crear borrador |
| PUT | `/api/dedications/:id` | code/draft | Actualizar borrador |
| GET | `/api/dedications/:slug` | — | Ver dedicatoria pública |
| GET | `/api/dedications/by-code/:code` | code | Recuperar por código |
| POST | `/api/payments/create` | — | Crear preferencia MP |
| POST | `/api/payments/webhook` | MP signature | Webhook MP |
| POST | `/api/upload` | draft | Subir imagen |
| POST | `/api/admin/login` | — | Login admin |
| GET | `/api/admin/dashboard` | JWT | Métricas |
| CRUD | `/api/admin/templates` | JWT | Gestionar plantillas |
| CRUD | `/api/admin/categories` | JWT | Gestionar categorías |

### 9.2 Formato de respuesta

```json
{
  "success": true,
  "data": { },
  "meta": { "page": 1, "total": 25 }
}
```

```json
{
  "success": false,
  "error": {
    "code": "PAYMENT_FAILED",
    "message": "El pago no pudo procesarse"
  }
}
```

---

## 10. Panel administrador

**URL:** `/admin` (no enlazado en web pública, `noindex`).

### 10.1 Pantallas

| Pantalla | Ruta | Funciones |
|----------|------|-----------|
| Login | `/admin/login` | Email + password → JWT |
| Dashboard | `/admin` | Ventas hoy/semana/mes, visitas, conversión |
| Plantillas | `/admin/templates` | CRUD, activar/desactivar, reordenar |
| Categorías | `/admin/categories` | CRUD, asignar plantillas |
| Ventas | `/admin/orders` | Listado, filtros, reembolsos |
| Dedicatorias | `/admin/dedications` | Ver, moderar, eliminar |
| Usuarios | `/admin/users` | Admin users CRUD |
| SEO | `/admin/seo` | Meta tags, sitemap, OG images |
| Analytics | `/admin/analytics` | Gráficos visitas, plantillas top |
| Logs | `/admin/logs` | Audit trail |
| Configuración | `/admin/settings` | Precios, monedas, feature flags |

### 10.2 Permisos (RBAC)

| Rol | Permisos |
|-----|----------|
| `superadmin` | Todo |
| `editor` | Plantillas, categorías, SEO |
| `support` | Dedicatorias (lectura), órdenes (lectura) |
| `analyst` | Dashboard, analytics (solo lectura) |

### 10.3 MVP actual (legacy)

El `admin.html` actual permite editar textos de landing en vivo y descargar `index.html`. Se reemplazará por el panel Next.js en v1.0, manteniendo la funcionalidad de edición de contenido.

---

## 11. Plantillas

### 11.1 Estructura de una plantilla

```
templates/hello-kitty/
├── template.json       # Metadata, campos, tier, precio
├── index.html          # HTML con placeholders
├── styles.css          # Estilos propios (opcional)
├── script.js           # Animaciones propias (opcional)
├── assets/
│   ├── preview.webp    # Thumbnail catálogo
│   └── ...
└── README.md           # Documentación de la plantilla
```

### 11.2 template.json

```json
{
  "slug": "hello-kitty",
  "code": "UWU-HKIT",
  "name": "Hello Kitty Mágica",
  "emoji": "🎀",
  "category": "sorprender",
  "tier": "exclusive",
  "price": { "pen": "8.00", "usd": "2.49" },
  "fields": [
    { "key": "para", "type": "text", "label": "Para quién", "maxLength": 50 },
    { "key": "de", "type": "text", "label": "Tu nombre", "maxLength": 50 },
    { "key": "mensaje", "type": "textarea", "label": "Mensaje", "maxLength": 2000 },
    { "key": "cancion", "type": "music", "label": "Canción" }
  ],
  "placeholders": ["__UWU_MSG__", "__UWU_SUBTITLE__", "__UWU_CODE__"],
  "previewGradient": "linear-gradient(135deg,#e542a1,#3890dd,#c654ce)"
}
```

### 11.3 Placeholders estándar

| Placeholder | Descripción |
|-------------|-------------|
| `__UWU_PARA__` | Nombre destinatario |
| `__UWU_DE__` | Nombre remitente |
| `__UWU_MSG__` | Mensaje principal |
| `__UWU_SUBTITLE__` | Subtítulo compuesto |
| `__UWU_CODE__` | Código de acceso |
| `__UWU_SONG__` | Canción |
| `__UWU_IMAGES__` | JSON de URLs de imágenes |

### 11.4 Reglas de construcción

1. Cada plantilla funciona **standalone** (abrible como HTML único).
2. No dependencias externas obligatorias (CDN opcional: Google Fonts).
3. Responsive obligatorio (`min-height: 100svh`, `max-width` en cards).
4. `prefers-reduced-motion` respetado.
5. Footer UWU obligatorio en tier `free`.

---

## 12. Sistema de pagos

### 12.1 Flujo Mercado Pago

```
1. Usuario confirma checkout
2. Frontend → POST /api/payments/create { draftId, currency }
3. Backend crea preferencia MP → retorna { initPoint, preferenceId }
4. Frontend redirige a initPoint
5. Usuario paga en MP
6. MP → POST /api/payments/webhook
7. Backend valida firma, actualiza order → paid
8. Backend dispara generación de dedicatoria
9. Frontend (return_url) muestra éxito con código + enlace
```

### 12.2 Estados de pago

| Estado | Descripción | Acción |
|--------|-------------|--------|
| `pending` | Preferencia creada, sin pago | Esperar |
| `approved` | Pago exitoso | Generar dedicatoria |
| `rejected` | Pago rechazado | Permitir reintento |
| `cancelled` | Usuario canceló | Cerrar orden |
| `refunded` | Reembolso procesado | Desactivar dedicatoria |

### 12.3 Webhook — validación

```typescript
// Verificar x-signature header de Mercado Pago
// Idempotencia: ignorar notification_id duplicados
// Siempre responder 200 para evitar reintentos infinitos
```

### 12.4 Reintentos

- MP reintenta webhooks hasta 48h.
- Backend usa tabla `webhook_events` con `notification_id` UNIQUE.
- Cron job cada 15 min: órdenes `pending` > 1h → marcar `expired`.

---

## 13. Seguridad

### 13.1 HTTPS

Obligatorio en todos los entornos excepto `development`. HSTS habilitado en producción.

### 13.2 Autenticación

| Contexto | Método |
|----------|--------|
| Admin | JWT (access 1h, refresh 7d) |
| Usuario (código) | Código acceso como bearer temporal |
| Webhook MP | Firma HMAC x-signature |
| API pública | Rate limit por IP |

### 13.3 Rate limiting

| Endpoint | Límite |
|----------|--------|
| `POST /api/payments/create` | 10/min por IP |
| `POST /api/dedications/draft` | 20/min por IP |
| `POST /api/upload` | 30/min por IP |
| `POST /api/admin/login` | 5/min por IP |
| General | 100/min por IP |

### 13.4 Validaciones

- Sanitización HTML en mensajes (DOMPurify server-side).
- Validación MIME real en uploads (no solo extensión).
- Slug: solo `[a-z0-9-]`, generado server-side.
- Precios: nunca aceptados desde frontend; siempre calculados en backend.

### 13.5 Secretos

```
# Nunca en frontend
MERCADOPAGO_ACCESS_TOKEN
MERCADOPAGO_WEBHOOK_SECRET
JWT_SECRET
DATABASE_URL
```

Almacenados en Vercel/Railway env vars. `.env.example` en repo sin valores reales.

---

## 14. Diseño

Referencia absoluta: [design-bible/UWU-DESIGN-BIBLE.md](./design-bible/UWU-DESIGN-BIBLE.md)

### 14.1 Tokens de color

```css
:root {
  --pink-50:  #FDF2F7;
  --pink-100: #FBE4EF;
  --pink-300: #F4A7CB;
  --pink-500: #EE7EB1;
  --pink-600: #E75FA0;
  --rose-500: #E8447A;
  --bear-600: #7A4E2D;
  --cream:    #FFF9F5;
  --night:    #1C1420;
  --ink:      #241722;
  --muted:    #8a6f7c;
  --grad-hero: linear-gradient(135deg, #EE7EB1 0%, #E8447A 60%, #C2418F 100%);
}
```

### 14.2 Tipografía

| Uso | Familia | Pesos |
|-----|---------|-------|
| Display / títulos | Sora | 600, 700, 800 |
| Script / romántico | Dancing Script | 600, 700 |
| Cuerpo / UI | Inter | 400, 500, 600, 700 |

### 14.3 Espaciado

Escala base 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80`.

### 14.4 Animaciones

- Librería: **Framer Motion** en React.
- Duración estándar: `0.25s` (micro), `0.7s` (reveal).
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Siempre respetar `prefers-reduced-motion`.

### 14.5 Glassmorphism

```css
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(18px);
border: 1px solid rgba(238, 126, 177, 0.28);
box-shadow: 0 8px 30px rgba(238, 126, 177, 0.14);
```

---

## 15. Convenciones

### 15.1 Código

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos componente | PascalCase.tsx | `TemplateCard.tsx` |
| Hooks | camelCase, prefijo `use` | `useCatalog.ts` |
| Utilidades | camelCase.ts | `formatPrice.ts` |
| Constantes | UPPER_SNAKE | `MAX_MESSAGE_LENGTH` |
| API routes | kebab-case | `/api/dedications/by-code` |
| BD tablas | snake_case plural | `dedication_images` |
| Enums | PascalCase | `PaymentStatus` |

### 15.2 Git

- **Branches:** `main` (prod), `develop`, `feature/*`, `fix/*`, `release/*`
- **Commits:** Conventional Commits — `feat(catalog): add level filter`
- **PRs:** requieren 1 review + CI verde

### 15.3 Crear nueva plantilla

1. Copiar `templates/_base/` → `templates/nueva-plantilla/`
2. Editar `template.json` con metadata y campos.
3. Diseñar `index.html` con placeholders estándar.
4. Ejecutar `npm run template:validate nueva-plantilla`
5. Agregar seed en `database/seeds/templates.ts`
6. Actualizar catálogo en blueprint Tomo IX.

### 15.4 Crear nueva categoría

1. Insertar en `categories` via seed o admin panel.
2. Asignar plantillas existentes o crear nuevas.
3. Agregar ruta en frontend `/catalogo/[slug]`.
4. Actualizar sitemap.

---

## 16. Roadmap

### 16.1 MVP (v1.0) — Lanzamiento

- [ ] Monorepo con frontend + backend + docker
- [ ] Catálogo con categorías y 3 niveles
- [ ] Editor básico (texto + 1 foto + canción)
- [ ] Pagos Mercado Pago PEN
- [ ] Generación HTML + enlace compartible
- [ ] Panel admin (plantillas, ventas, dashboard)
- [ ] 10 plantillas migradas del MVP actual
- [ ] SEO básico (sitemap, OG, metadata)

### 16.2 v1.1 — Mejoras

- [ ] Soporte USD completo
- [ ] Editor drag & drop
- [ ] QR dinámico con logo UWU
- [ ] Centro de gestión por código
- [ ] Analytics avanzado
- [ ] 25 plantillas completas

### 16.3 v2.0 — Expansión

- [ ] Integración Spotify/YouTube embebido
- [ ] Funciones IA (generar mensajes, sugerir canciones)
- [ ] i18n (inglés, portugués)
- [ ] Dominio personalizado por dedicatoria
- [ ] API pública para partners
- [ ] App PWA instalable

---

## 17. Reglas de desarrollo

> **Instrucciones obligatorias para todo desarrollador y asistente IA.**

1. **Nunca duplicar código.** Si algo se usa 2+ veces, extraer componente/función.
2. **Componentes reutilizables.** UI en `components/ui/` (Shadcn), negocio en `components/{modulo}/`.
3. **No escribir CSS repetido.** Usar Tailwind utilities + tokens del Design Bible.
4. **Toda funcionalidad es modular.** Un módulo = una carpeta en `backend/src/modules/`.
5. **Cada plantilla es independiente.** No compartir lógica entre plantillas salvo `_base/`.
6. **Toda lógica de negocio va en el backend.** Frontend solo presenta y valida UX.
7. **Ninguna clave o secreto en el frontend.** Variables `NEXT_PUBLIC_*` solo para datos públicos.
8. **Compatibilidad.** Todo cambio debe mantener APIs existentes o versionar (`/api/v2/`).
9. **Documentar antes de implementar.** Actualizar blueprint + changelog del módulo.
10. **Tests mínimos.** Cada endpoint crítico (pagos, generación, auth) tiene test e2e.
11. **Accesibilidad.** Contraste WCAG AA, focus visible, aria-labels en botones.
12. **Performance.** Imágenes WebP, lazy loading, code splitting por ruta.
13. **Errores graceful.** Nunca pantalla blanca; siempre fallback con mensaje amigable.
14. **Idioma.** UI en español. Código (variables, comentarios técnicos) en inglés.

---

*Fin del Software Blueprint v0.1.0*
