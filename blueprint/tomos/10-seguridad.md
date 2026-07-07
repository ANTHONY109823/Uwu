# 📖 Tomo X — Seguridad

## HTTPS

- Obligatorio en staging y producción
- HSTS: `max-age=31536000; includeSubDomains`
- Certificados automáticos via Vercel/Railway
- Redirect HTTP → HTTPS

---

## JWT (Administrador)

| Token | Duración | Uso |
|-------|----------|-----|
| Access | 1 hora | API requests |
| Refresh | 7 días | Renovar access |

```typescript
// Payload JWT admin
{
  sub: "admin-uuid",
  email: "admin@uwu.app",
  role: "superadmin",
  iat: 1234567890,
  exp: 1234571490
}
```

**Almacenamiento frontend:** httpOnly cookie (no localStorage).

---

## Código de acceso (usuario)

- Formato: `UWU-XXXX-XXXX`
- Generado server-side con `crypto.randomBytes`
- Sin caracteres ambiguos (0/O, 1/I/L)
- UNIQUE en BD
- Usado como bearer token temporal para editar dedicatoria
- No es JWT — es un secreto compartido usuario-sistema

---

## Rate Limit

Implementar con `@nestjs/throttler` o Redis.

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| General API | 100 | 1 min |
| POST /payments/create | 10 | 1 min |
| POST /dedications/draft | 20 | 1 min |
| POST /upload | 30 | 1 min |
| POST /admin/login | 5 | 1 min |

Respuesta 429:
```json
{ "success": false, "error": { "code": "RATE_LIMITED", "message": "Demasiadas solicitudes. Intenta en un momento." } }
```

---

## Logs

| Tipo | Destino | Retención |
|------|---------|-----------|
| Audit (admin) | `audit_logs` tabla | 1 año |
| Errores API | Railway logs + Sentry | 30 días |
| Webhooks MP | `webhook_events` tabla | 90 días |
| Acceso | Vercel analytics | 30 días |

**Nunca loguear:** passwords, tokens completos, datos de tarjeta.

---

## Webhooks

- Validar firma `x-signature` de Mercado Pago (HMAC SHA256)
- Idempotencia con `notification_id` UNIQUE
- Responder 200 siempre (incluso si duplicado)
- Timeout de procesamiento: 10s max

Ver implementación: [diagramas/flujo-pagos.md](../diagramas/flujo-pagos.md)

---

## Validaciones

### Input
- Sanitización HTML: DOMPurify server-side en mensajes
- Validación de tipos con class-validator (NestJS)
- Slug: regex `^[a-z0-9-]+$`, generado server-side
- Email: formato RFC 5322

### Upload
- Validar MIME real (magic bytes, no solo extensión)
- Tamaño máximo: 5 MB
- Formatos: JPEG, PNG, WebP
- Renombrar archivos (UUID, no nombre original)
- Scan básico de contenido

### Precios
- **Nunca** aceptar precio desde frontend
- Backend calcula: `template.price ?? level.price` según currency

---

## CORS

```typescript
// Solo dominios permitidos
origin: ['https://uwu.app', 'https://staging.uwu.app', 'http://localhost:3000']
```

---

## Headers de seguridad

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY (excepto preview iframe same-origin)
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

---

## Secretos

| Variable | Dónde |
|----------|-------|
| `JWT_SECRET` | Railway env |
| `MERCADOPAGO_ACCESS_TOKEN` | Railway env |
| `MERCADOPAGO_WEBHOOK_SECRET` | Railway env |
| `DATABASE_URL` | Railway env |
| `NEXT_PUBLIC_API_URL` | Vercel env (público, OK) |

`.env.example` en repo sin valores reales. `.env` en `.gitignore`.
