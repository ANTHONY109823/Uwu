# 📖 Tomo V — Base de Datos

> Esquema SQL completo: [database/schema.sql](../database/schema.sql)  
> Diagrama ERD: [diagramas/erd.md](../diagramas/erd.md)

## Tablas

### Core

| Tabla | Registros est. | Descripción |
|-------|----------------|-------------|
| `categories` | 12 | Categorías del catálogo |
| `levels` | 3 | free, premium, exclusive |
| `templates` | 25+ | Plantillas con metadata |
| `template_fields` | ~100 | Campos del editor por plantilla |

### Transaccional

| Tabla | Descripción |
|-------|-------------|
| `users_temp` | Usuarios anónimos (email opcional) |
| `orders` | Órdenes de compra / borradores |
| `payments` | Transacciones Mercado Pago |
| `webhook_events` | Idempotencia de webhooks |
| `dedications` | Dedicatorias generadas |
| `dedication_images` | Imágenes subidas |
| `dedication_music` | Referencias de música |

### Analytics y admin

| Tabla | Descripción |
|-------|-------------|
| `visits` | Registro de visitas a dedicatorias |
| `admin_users` | Usuarios del panel admin |
| `audit_logs` | Trail de acciones admin |
| `settings` | Configuración global (KV) |

---

## Relaciones principales

```
categories 1──N templates
levels     1──N templates
templates  1──N template_fields
templates  1──N orders
orders     1──0..1 payments
orders     1──0..1 dedications
dedications 1──N dedication_images
dedications 1──0..1 dedication_music
dedications 1──N visits
```

---

## Índices

### UNIQUE (integridad)
- `templates.slug`, `templates.code`
- `dedications.slug`, `dedications.access_code`
- `payments.mercadopago_id`
- `webhook_events.notification_id`
- `admin_users.email`

### Performance
- `templates(is_active, sort_order)` — catálogo
- `orders(status)` — dashboard ventas
- `visits(dedication_id)` — analytics
- `visits(created_at DESC)` — gráficos temporales
- `audit_logs(created_at DESC)` — logs recientes

---

## Normalización

- **3NF** en todas las tablas principales
- Imágenes separadas de dedications (1NF)
- Precios base en `levels`, override opcional en `templates` (3NF con denormalización controlada)
- Contadores cacheados (`visit_count`, `purchase_count`) actualizados por triggers

---

## Migraciones

```
database/
├── schema.sql          # Esquema completo
├── migrations/         # Prisma migrations
│   ├── 001_init.sql
│   ├── 002_add_visits.sql
│   └── ...
└── seeds/
    ├── categories.ts
    ├── levels.ts
    └── templates.ts    # Migrar las 25 del MVP
```

### Comando

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## Seeds — Plantillas del MVP

Las 25 plantillas actuales en `docs/js/uwu.js` → `CATALOG` se migran a `templates` con su categoría, nivel, precio y código existente.

Ejemplo:
```sql
INSERT INTO templates (slug, code, name, emoji, category_id, level_id, price_pen, price_usd, ...)
VALUES ('hello-kitty', 'UWU-HKIT', 'Hello Kitty Mágica', '🎀', 9, 3, 8.00, 2.49, ...);
```

---

## Backups

| Frecuencia | Método | Retención |
|------------|--------|-----------|
| Diario | Railway automated backup | 7 días |
| Semanal | pg_dump → S3 | 30 días |
| Pre-deploy | Manual snapshot | 1 por release |
