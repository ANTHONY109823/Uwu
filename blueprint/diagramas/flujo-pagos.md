# 💳 Flujo de Pagos — UWU

## Diagrama de secuencia

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant A as API (NestJS)
    participant DB as PostgreSQL
    participant MP as Mercado Pago
    participant G as Generator

    U->>F: Confirma checkout
    F->>A: POST /api/payments/create { orderId }
    A->>DB: Verificar order (status: draft)
    A->>MP: Crear preferencia de pago
    MP-->>A: { preferenceId, initPoint }
    A->>DB: Crear payment (status: pending)
    A->>DB: Update order (status: pending)
    A-->>F: { initPoint }
    F->>MP: Redirige a checkout MP
    U->>MP: Completa pago
    MP->>A: POST /api/payments/webhook
    A->>A: Validar firma x-signature
    A->>DB: Check idempotencia (notification_id)
    A->>DB: Update payment (status: approved)
    A->>DB: Update order (status: paid)
    A->>G: Generar dedicatoria
    G->>DB: Crear dedication + slug + access_code
    G-->>A: { slug, url, accessCode }
    A-->>MP: 200 OK
    MP-->>U: Redirige a return_url
    U->>F: Página de éxito
    F->>A: GET /api/payments/status/:orderId
    A-->>F: { status: paid, dedication }
    F-->>U: Muestra código + enlace + descarga
```

---

## Flujo gratis (sin Mercado Pago)

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant A as API
    participant G as Generator
    participant DB as PostgreSQL

    U->>F: Clic "Obtener gratis"
    F->>A: POST /api/payments/free { orderId }
    A->>DB: Verificar template.level = free
    A->>DB: Update order (status: free)
    A->>G: Generar dedicatoria
    G->>DB: Crear dedication (con footer UWU)
    G-->>A: { slug, url, accessCode }
    A-->>F: { dedication }
    F-->>U: Código + enlace + descarga
```

---

## Estados de pago

| Estado MP | Estado interno | Acción |
|-----------|----------------|--------|
| `pending` | `pending` | Esperar webhook |
| `approved` | `approved` | Generar dedicatoria |
| `rejected` | `rejected` | Permitir reintento |
| `cancelled` | `cancelled` | Cerrar orden |
| `refunded` | `refunded` | Desactivar dedicatoria |

---

## Manejo de errores

### Webhook duplicado
```
1. Buscar notification_id en webhook_events
2. Si existe → responder 200, no procesar
3. Si no existe → procesar y guardar
```

### Pago aprobado pero generación falla
```
1. Payment queda en approved
2. Order queda en paid
3. dedication = null
4. Cron job reintenta generación cada 5 min (max 3 intentos)
5. Si falla 3 veces → alerta admin + log crítico
```

### Usuario cierra ventana de MP
```
1. Order queda en pending
2. Cron: pending > 1h → expired
3. Usuario puede crear nueva orden desde editor
```

---

## Configuración Mercado Pago

### Variables de entorno

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
MERCADOPAGO_WEBHOOK_SECRET=xxx
MERCADOPAGO_PUBLIC_KEY=APP_USR-xxx
```

### Preferencia de pago

```json
{
  "items": [{
    "title": "UWU — Hello Kitty Mágica",
    "quantity": 1,
    "unit_price": 8.00,
    "currency_id": "PEN"
  }],
  "back_urls": {
    "success": "https://uwu.app/checkout/success?order={orderId}",
    "failure": "https://uwu.app/checkout/failure?order={orderId}",
    "pending": "https://uwu.app/checkout/pending?order={orderId}"
  },
  "notification_url": "https://api.uwu.app/api/payments/webhook",
  "external_reference": "{orderId}",
  "auto_return": "approved"
}
```

---

## Seguridad del webhook

```typescript
// Validación de firma Mercado Pago
function validateWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string,
  secret: string
): boolean {
  const parts = xSignature.split(',');
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
  const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  return computed === hash;
}
```
