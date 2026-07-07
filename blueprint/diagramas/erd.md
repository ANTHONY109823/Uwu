# 🗄️ Diagrama Entidad-Relación (ERD) — UWU

```mermaid
erDiagram
    categories ||--o{ templates : "tiene"
    levels ||--o{ templates : "define precio"
    templates ||--o{ template_fields : "tiene campos"
    templates ||--o{ orders : "se compra en"
    templates ||--o{ dedications : "genera"
    users_temp ||--o{ orders : "crea"
    orders ||--o| payments : "tiene"
    orders ||--o| dedications : "produce"
    dedications ||--o{ dedication_images : "contiene"
    dedications ||--o| dedication_music : "tiene"
    dedications ||--o{ visits : "recibe"
    admin_users ||--o{ audit_logs : "genera"

    categories {
        serial id PK
        varchar slug UK
        varchar name
        varchar emoji
        text description
        int sort_order
        boolean is_active
    }

    levels {
        serial id PK
        tier_level code UK
        varchar name
        varchar emoji
        decimal price_pen
        decimal price_usd
        jsonb features
    }

    templates {
        serial id PK
        varchar slug UK
        varchar code UK
        varchar name
        int category_id FK
        int level_id FK
        decimal price_pen
        decimal price_usd
        boolean is_active
        boolean is_featured
    }

    template_fields {
        serial id PK
        int template_id FK
        varchar field_key
        varchar field_type
        varchar label
        int max_length
        boolean is_required
    }

    users_temp {
        uuid id PK
        varchar email
        varchar ip_hash
        timestamptz created_at
    }

    orders {
        uuid id PK
        uuid user_id FK
        int template_id FK
        order_status status
        varchar currency
        decimal amount
        jsonb draft_data
        timestamptz expires_at
    }

    payments {
        uuid id PK
        uuid order_id FK
        varchar mercadopago_id UK
        payment_status status
        decimal amount
        jsonb mp_raw_response
    }

    dedications {
        uuid id PK
        uuid order_id FK
        int template_id FK
        varchar slug UK
        varchar access_code UK
        varchar para
        varchar de
        text mensaje
        boolean is_active
        int visit_count
    }

    dedication_images {
        uuid id PK
        uuid dedication_id FK
        varchar url
        varchar storage_key
        varchar mime_type
        int size_bytes
    }

    dedication_music {
        uuid id PK
        uuid dedication_id FK
        music_source source
        varchar title
        varchar url
    }

    visits {
        bigserial id PK
        uuid dedication_id FK
        varchar ip_hash
        varchar referrer
        timestamptz created_at
    }

    admin_users {
        uuid id PK
        varchar email UK
        varchar password_hash
        admin_role role
        boolean is_active
    }

    audit_logs {
        bigserial id PK
        uuid admin_id FK
        varchar action
        varchar entity_type
        jsonb details
    }

    webhook_events {
        uuid id PK
        varchar notification_id UK
        jsonb payload
        boolean processed
    }

    settings {
        varchar key PK
        jsonb value
    }
```

---

## Relaciones clave

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| categories → templates | 1:N | Una categoría tiene muchas plantillas |
| levels → templates | 1:N | Un nivel define el tier de muchas plantillas |
| templates → template_fields | 1:N | Campos configurables del editor |
| orders → payments | 1:0..1 | Una orden tiene máximo un pago |
| orders → dedications | 1:0..1 | Una orden genera una dedicatoria |
| dedications → dedication_images | 1:N | Hasta 10 imágenes según nivel |
| dedications → visits | 1:N | Analytics de visitas |

---

## Índices críticos

```sql
-- Búsquedas frecuentes
idx_templates_slug          UNIQUE ON templates(slug)
idx_dedications_slug        UNIQUE ON dedications(slug)
idx_dedications_access_code UNIQUE ON dedications(access_code)
idx_payments_mp_id          UNIQUE ON payments(mercadopago_id)
idx_webhook_events_notif    UNIQUE ON webhook_events(notification_id)

-- Filtros y ordenamiento
idx_templates_active        ON templates(is_active, sort_order)
idx_orders_status           ON orders(status)
idx_visits_dedication       ON visits(dedication_id)
idx_visits_created          ON visits(created_at DESC)
idx_audit_logs_created      ON audit_logs(created_at DESC)
```

---

## Normalización

| Forma | Estado |
|-------|--------|
| 1NF | ✅ Sin grupos repetitivos (imágenes en tabla separada) |
| 2NF | ✅ Todos los campos dependen de PK completa |
| 3NF | ✅ Sin dependencias transitivas (precio en levels, override en templates) |

**Denormalización intencional:**
- `templates.visit_count` y `templates.purchase_count` — contadores cacheados, actualizados por triggers/cron
- `dedications.visit_count` — evita COUNT(*) en cada request
