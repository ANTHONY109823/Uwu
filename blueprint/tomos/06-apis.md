# 📖 Tomo VI — APIs

> Referencia completa: [api/endpoints.md](../api/endpoints.md)

## Resumen de endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categories` | Listar categorías |
| GET | `/api/categories/:slug` | Categoría con plantillas |
| GET | `/api/templates` | Listar plantillas (filtros) |
| GET | `/api/templates/:slug` | Detalle plantilla |
| POST | `/api/dedications/draft` | Crear borrador |
| PUT | `/api/dedications/:id` | Actualizar borrador |
| GET | `/api/dedications/:slug` | Ver dedicatoria pública |
| GET | `/api/dedications/by-code/:code` | Recuperar por código |
| GET | `/api/dedications/:id/preview` | HTML preview |
| GET | `/api/dedications/:slug/qr` | Imagen QR |

### Pagos

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/payments/create` | Crear preferencia MP |
| POST | `/api/payments/webhook` | Webhook Mercado Pago |
| GET | `/api/payments/status/:orderId` | Estado de pago |
| POST | `/api/payments/free` | Generar gratis |

### Uploads

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/upload` | Subir imagen |
| DELETE | `/api/upload/:id` | Eliminar imagen |

### Compartir

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/share/whatsapp` | URL WhatsApp |

### Admin (JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/login` | Login |
| POST | `/api/admin/refresh` | Refresh token |
| GET | `/api/admin/dashboard` | Métricas |
| CRUD | `/api/admin/templates` | Gestionar plantillas |
| CRUD | `/api/admin/categories` | Gestionar categorías |
| GET | `/api/admin/orders` | Listar órdenes |
| GET | `/api/admin/dedications` | Listar dedicatorias |
| DELETE | `/api/admin/dedications/:id` | Moderar |
| CRUD | `/api/admin/users` | Admin users |
| GET | `/api/admin/analytics` | Gráficos |
| GET | `/api/admin/logs` | Audit trail |
| GET/PUT | `/api/admin/settings` | Configuración |

---

## Autenticación

| Contexto | Método |
|----------|--------|
| Admin | `Authorization: Bearer <jwt>` |
| Código dedicatoria | `Authorization: Bearer <access_code>` |
| Webhook MP | Header `x-signature` (HMAC) |
| Público | Sin auth (rate limited) |

---

## Formato de respuesta

### Éxito
```json
{ "success": true, "data": {}, "meta": { "page": 1, "total": 25 } }
```

### Error
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

---

## Rate limiting

| Endpoint | Límite |
|----------|--------|
| General | 100 req/min por IP |
| `/api/payments/create` | 10/min |
| `/api/dedications/draft` | 20/min |
| `/api/upload` | 30/min |
| `/api/admin/login` | 5/min |

---

## Versionado

- v1: ruta actual `/api/...`
- Futuro breaking change: `/api/v2/...` con 90 días de gracia en v1
