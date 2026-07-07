# 📖 Tomo VII — Panel Administrador

**URL:** `/admin` (noindex, no enlazado en web pública)

## Pantallas

### Login — `/admin/login`

| Elemento | Detalle |
|----------|---------|
| Email | Input validado |
| Password | Input type password |
| Botón | "Ingresar" → POST `/api/admin/login` |
| Error | Toast "Credenciales incorrectas" |

---

### Dashboard — `/admin`

| Widget | Datos |
|--------|-------|
| Ventas hoy | count + monto PEN |
| Ventas semana | count + monto |
| Visitas hoy | total pageviews |
| Conversión | % checkout → pago |
| Top 5 plantillas | Por compras |
| Gráfico ventas | Últimos 30 días |

---

### Plantillas — `/admin/templates`

| Acción | Botón | Permiso |
|--------|-------|---------|
| Listar | Tabla con filtros | analyst |
| Crear | "+ Nueva plantilla" | editor |
| Editar | ✏️ por fila | editor |
| Activar/Desactivar | Toggle | editor |
| Eliminar | 🗑 con confirmación | superadmin |
| Reordenar | Drag & drop sort | editor |

**Campos editables:** nombre, categoría, nivel, precio, emoji, descripción, featured, sort_order.

---

### Categorías — `/admin/categories`

CRUD completo. Campos: slug, name, emoji, description, sort_order, is_active.

---

### Ventas — `/admin/orders`

| Columna | Descripción |
|---------|-------------|
| ID | UUID corto |
| Fecha | created_at |
| Plantilla | Nombre |
| Monto | PEN/USD |
| Estado | draft/pending/paid/free/failed |
| Acciones | Ver detalle, reembolsar |

**Filtros:** estado, fecha, plantilla, moneda.

---

### Dedicatorias — `/admin/dedications`

| Columna | Descripción |
|---------|-------------|
| Slug | Enlace público |
| Para / De | Nombres |
| Plantilla | Nombre |
| Visitas | visit_count |
| Estado | Activa/Inactiva |
| Acciones | Ver, desactivar, eliminar |

---

### Usuarios — `/admin/users`

Solo `superadmin`. CRUD de admin_users con roles.

---

### SEO — `/admin/seo`

| Campo | Descripción |
|-------|-------------|
| Meta title | Título global |
| Meta description | Descripción global |
| OG image | URL imagen compartir |
| Regenerar sitemap | Botón manual |

---

### Analytics — `/admin/analytics`

- Gráfico visitas por día (30 días)
- Plantillas más vistas vs más compradas
- Fuentes de tráfico (referrer)
- Dispositivos (mobile/desktop)

---

### Logs — `/admin/logs`

Tabla paginada de `audit_logs`: fecha, admin, acción, entidad, detalles JSON.

---

### Configuración — `/admin/settings`

| Setting | Tipo |
|---------|------|
| Precios por nivel | JSON |
| Monedas activas | array |
| Feature flags | JSON |
| Mantenimiento | boolean |

---

## Permisos (RBAC)

| Rol | Acceso |
|-----|--------|
| `superadmin` | Todo |
| `editor` | Plantillas, categorías, SEO |
| `support` | Dedicatorias y órdenes (lectura), moderar |
| `analyst` | Dashboard y analytics (lectura) |

---

## MVP actual (legacy)

`docs/admin.html`:
- Editar textos de landing en vivo
- Ocultar/reordenar/eliminar secciones
- Descargar `index.html` actualizado

Se migrará a panel Next.js manteniendo funcionalidad de edición de contenido.
