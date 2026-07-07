# 🔌 API REST — UWU

> Base URL producción: `https://api.uwu.app`  
> Base URL desarrollo: `http://localhost:4000`  
> Versión: v1

---

## Convenciones

- Formato: JSON (`Content-Type: application/json`)
- Auth admin: `Authorization: Bearer <jwt>`
- Auth dedicatoria: `Authorization: Bearer <access_code>` o query `?code=UWU-XXXX-XXXX`
- Errores: `{ "success": false, "error": { "code": "...", "message": "..." } }`
- Paginación: `?page=1&limit=20` → `meta: { page, limit, total, totalPages }`

---

## Públicos

### GET /api/categories

Lista categorías activas.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "amor",
      "name": "Amor",
      "emoji": "❤️",
      "templateCount": 5
    }
  ]
}
```

---

### GET /api/categories/:slug

Detalle de categoría con plantillas.

**Params:** `slug` — ej. `cumpleanos`

---

### GET /api/templates

Lista plantillas con filtros.

**Query params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `category` | string | Slug de categoría |
| `level` | string | `free`, `premium`, `exclusive` |
| `featured` | boolean | Solo destacadas |
| `search` | string | Búsqueda por nombre |
| `page` | number | Página (default 1) |
| `limit` | number | Por página (default 20) |
| `currency` | string | `PEN` o `USD` |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "slug": "hello-kitty",
      "code": "UWU-HKIT",
      "name": "Hello Kitty Mágica",
      "emoji": "🎀",
      "category": "sorprender",
      "level": "exclusive",
      "price": { "pen": "8.00", "usd": "2.49", "formatted": "S/ 8.00" },
      "previewGradient": "linear-gradient(135deg,#e542a1,#3890dd)",
      "pill": "Tocar para abrir 🎀"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 25 }
}
```

---

### GET /api/templates/:slug

Detalle completo de plantilla incluyendo campos del editor.

---

### POST /api/dedications/draft

Crea borrador de dedicatoria.

**Body:**
```json
{
  "templateSlug": "hello-kitty",
  "para": "Mariana",
  "de": "Diego",
  "mensaje": "Eres el sueño que nunca quiero despertar 🌙",
  "cancion": "Ed Sheeran — Perfect",
  "currency": "PEN"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "status": "draft",
    "previewUrl": "/api/dedications/preview/uuid"
  }
}
```

---

### PUT /api/dedications/:id

Actualiza borrador.

**Auth:** orderId en sesión o cookie.

---

### GET /api/dedications/:slug

Dedicatoria pública por slug.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "slug": "abc123",
    "para": "Mariana",
    "de": "Diego",
    "mensaje": "...",
    "template": { "name": "Hello Kitty Mágica", "emoji": "🎀" },
    "images": [],
    "music": { "source": "text", "title": "Ed Sheeran — Perfect" },
    "htmlUrl": "https://uwu.app/d/abc123",
    "createdAt": "2026-07-07T12:00:00Z"
  }
}
```

---

### GET /api/dedications/by-code/:code

Recupera dedicatoria por código de acceso.

**Params:** `code` — ej. `UWU-A7K2-9M4P`

---

### GET /api/dedications/:id/preview

HTML preview de borrador (Content-Type: text/html).

---

### GET /api/dedications/:slug/qr

Genera imagen QR PNG.

**Query:** `size=256` (default)

---

## Pagos

### POST /api/payments/create

Crea preferencia de pago Mercado Pago.

**Body:**
```json
{
  "orderId": "uuid",
  "currency": "PEN"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "preferenceId": "mp-pref-id",
    "initPoint": "https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=...",
    "amount": 8.00,
    "currency": "PEN"
  }
}
```

---

### POST /api/payments/webhook

Webhook de Mercado Pago. **No llamar manualmente.**

**Headers requeridos:** `x-signature`, `x-request-id`

**Proceso interno:**
1. Validar firma
2. Verificar idempotencia (`notification_id`)
3. Actualizar `payments.status`
4. Si `approved` → generar dedicatoria
5. Responder `200 OK`

---

### GET /api/payments/status/:orderId

Consulta estado de pago (polling frontend).

---

### POST /api/payments/free

Genera dedicatoria gratis (sin pasar por MP).

**Body:**
```json
{
  "orderId": "uuid"
}
```

---

## Uploads

### POST /api/upload

Sube imagen para dedicatoria.

**Content-Type:** `multipart/form-data`

**Fields:**
- `file` — imagen (max 5MB, JPG/PNG/WebP)
- `orderId` — UUID del borrador

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://cdn.uwu.app/uploads/...",
    "sortOrder": 0
  }
}
```

---

### DELETE /api/upload/:id

Elimina imagen subida.

---

## Compartir

### POST /api/share/whatsapp

Genera enlace WhatsApp con mensaje pre-formateado.

**Body:**
```json
{
  "slug": "abc123",
  "message": "Te hice algo especial 💝"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "whatsappUrl": "https://wa.me/?text=..."
  }
}
```

---

## Admin (requiere JWT)

### POST /api/admin/login

**Body:**
```json
{
  "email": "admin@uwu.app",
  "password": "..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt...",
    "refreshToken": "jwt...",
    "user": { "id": "uuid", "name": "Admin", "role": "superadmin" }
  }
}
```

---

### POST /api/admin/refresh

Renueva access token.

---

### GET /api/admin/dashboard

Métricas generales.

**Response:**
```json
{
  "success": true,
  "data": {
    "salesToday": { "count": 12, "amount": 96.00, "currency": "PEN" },
    "salesWeek": { "count": 87, "amount": 650.00 },
    "visitsToday": 342,
    "conversionRate": 3.5,
    "topTemplates": [
      { "slug": "hello-kitty", "name": "Hello Kitty Mágica", "purchases": 23 }
    ]
  }
}
```

---

### CRUD /api/admin/templates

| Método | Ruta | Acción | Rol mínimo |
|--------|------|--------|------------|
| GET | `/api/admin/templates` | Listar | analyst |
| POST | `/api/admin/templates` | Crear | editor |
| PUT | `/api/admin/templates/:id` | Actualizar | editor |
| DELETE | `/api/admin/templates/:id` | Eliminar | superadmin |
| PATCH | `/api/admin/templates/:id/toggle` | Activar/desactivar | editor |

---

### CRUD /api/admin/categories

Misma estructura que templates. Rol mínimo: `editor`.

---

### GET /api/admin/orders

Lista órdenes con filtros: `status`, `dateFrom`, `dateTo`, `templateId`.

---

### GET /api/admin/dedications

Lista dedicatorias. Filtros: `isActive`, `templateId`, `search`.

---

### DELETE /api/admin/dedications/:id

Desactiva dedicatoria (moderación). Rol: `support`.

---

### CRUD /api/admin/users

Gestión de admin users. Rol: `superadmin`.

---

### GET /api/admin/analytics

Datos para gráficos: visitas por día, ventas por plantilla, conversión.

---

### GET /api/admin/logs

Audit trail paginado.

---

### GET/PUT /api/admin/settings

Configuración global (precios, feature flags, SEO).

---

## Códigos de error

| Código | HTTP | Descripción |
|--------|------|-------------|
| `VALIDATION_ERROR` | 400 | Datos inválidos |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `UNAUTHORIZED` | 401 | Sin autenticación |
| `FORBIDDEN` | 403 | Sin permisos |
| `PAYMENT_FAILED` | 402 | Pago rechazado |
| `RATE_LIMITED` | 429 | Demasiadas solicitudes |
| `TEMPLATE_INACTIVE` | 400 | Plantilla desactivada |
| `ORDER_EXPIRED` | 410 | Orden expirada |
| `CODE_INVALID` | 404 | Código de acceso inválido |
| `UPLOAD_TOO_LARGE` | 413 | Archivo muy grande |
| `INTERNAL_ERROR` | 500 | Error interno |
