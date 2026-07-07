# 04 · Panel del Cliente y Panel del Administrador

> Cubre entregables: **11. Panel del administrador · 12. Panel del cliente**

Ambos paneles viven en `apps/web` (route groups `(dashboard)` y `(admin)`), consumen la API NestJS y comparten `packages/ui`. El admin usa un layout propio más denso (sidebar, tablas) y exige `role: ADMIN` verificado server-side en cada request — nunca solo ocultando UI.

---

## 12. Panel del Cliente (`/panel`)

Objetivo: que el comprador **vuelva** (editar, ver stats, duplicar para la próxima ocasión). El panel es el motor de recompra.

### Estructura

```
/panel                       Home: mis dedicatorias + accesos rápidos
/panel/dedicatorias/[id]     Detalle: editar · stats · compartir · QR
/panel/pedidos               Historial de compras y recibos
/panel/referidos             Mi enlace de referido + créditos ganados
/panel/cuenta                Perfil, contraseña, sesiones, eliminar cuenta
```

### Home del panel — wireframe

```
┌───────────────────────────────┐
│ Hola, Anthony 🧸   [+ Crear]  │
│ ┌───────────────────────────┐ │
│ │ 💝 Para Mariana            │ │  ← card por dedicatoria:
│ │ Carta Eterna · PUBLICADA   │ │    mini-preview, estado con color
│ │ 👁 214 vistas · ⏱ 1m 42s   │ │    (borrador/publicada/por expirar/
│ │ [Compartir][Editar][⋮]     │ │    expirada), stats resumidas
│ └───────────────────────────┘ │    menú ⋮: duplicar · QR · renovar ·
│ │ 📝 Borrador sin terminar…  │ │    contraseña · eliminar
│ │ [Continuar editando →]     │ │
│ └───────────────────────────┘ │
│ 💡 "El aniversario que        │  ← nudge inteligente (fecha guardada
│  registraste es en 12 días"   │     en la dedicatoria → recompra)
└───────────────────────────────┘
```

### Capacidades (mapa requisito → implementación)

| Requisito | Implementación |
|---|---|
| Crear / editar / duplicar / eliminar | CRUD sobre `/v1/dedications`; **editar una publicada** reabre el mismo editor y al guardar dispara `revalidateTag` → el enlace ya compartido se actualiza al instante (gran diferenciador vs. competencia) |
| Renovar enlaces | `POST /renew`: si el plan lo permite → extiende `expiresAt`; si no → checkout de renovación. Aviso por email 7 y 1 día antes de expirar |
| Cambiar imágenes/música/videos | El editor completo está disponible post-compra; nuevos uploads via presigned URLs respetando cuota del plan |
| Descargar QR | PNG (alta resolución para imprimir) y SVG, generados por worker y cacheados en R2; el QR usa la URL canónica → sobrevive a la migración de dominio |
| Compartir | `ShareBar`: WhatsApp (deep link con texto pre-armado), Instagram/TikTok (copia + instrucciones de sticker), Web Share API nativa en móvil |
| Estadísticas | Vistas totales y por día (sparkline), tiempo medio de permanencia, desbloqueos (si tiene contraseña), shares, origen (WhatsApp/QR/directo via `?src=`). Momento estrella: **notificación "💌 ¡Tu dedicatoria fue vista por primera vez!"** (email/push) |

Detalle anti-error: eliminar una dedicatoria **publicada y pagada** pide confirmación escrita ("escribe ELIMINAR") y aplica soft-delete con 30 días de recuperación.

---

## 11. Panel del Administrador (`/admin`)

Objetivo: operar el negocio **sin tocar la base de datos jamás**. Cada mutación queda en `audit_logs` (quién, qué, cuándo, valor anterior).

### Estructura y módulos

```
/admin                     Dashboard
/admin/usuarios            Usuarios y roles
/admin/ventas              Ventas y reportes
/admin/pedidos             Pedidos y pagos
/admin/plantillas          Catálogo de plantillas
/admin/categorias          Categorías
/admin/cupones             Cupones y promociones
/admin/afiliados           Afiliados y referidos
/admin/blog                Blog / contenido SEO
/admin/analytics           Analytics de producto
/admin/seo                 SEO global
/admin/configuracion       Configuración, roles, feature flags
/admin/logs                Logs y auditoría
/admin/backups             Backups
```

### Módulo a módulo

**Dashboard** — KPIs del día/semana/mes: ingresos, pedidos, conversión funnel (visita→editor→checkout→pago, datos PostHog + BD), dedicatorias publicadas, nuevos usuarios, MRR de suscripciones, top plantillas y top categorías. Gráfica de ingresos 30 días. Feed de actividad reciente.

**Usuarios** — búsqueda/filtros, detalle con dedicatorias y pedidos del usuario, cambiar rol (`CUSTOMER | SUPPORT | DESIGNER | ADMIN`), suspender cuenta, reset de contraseña, GDPR-style export/delete. Impersonar usuario (con banner visible y registro en audit log) para soporte.

**Ventas / Pedidos / Pagos** — listado de órdenes con estado y proveedor de pago; detalle con timeline de eventos de webhook (debugging de pagos sin salir del panel); **reembolso con un click** (llama a la API del proveedor y despublica opcionalmente la dedicatoria); export CSV; conciliación: alerta si un pago del proveedor no cuadra con una orden.

**Plantillas** — la tabla `templates` espejo del registry (doc 02 §5.3): activar/retirar, cambiar tier y precio, destacar en landing, reordenar, ver métricas por plantilla (vistas de demo → compras = tasa de conversión por plantilla, la métrica que decide qué plantillas construir después). El código de una plantilla nueva entra por PR; el admin controla su ciclo de vida comercial.

**Categorías** — CRUD, orden, emoji/gradiente (tokens `--cat-*`), SEO por categoría (title/description propios de `/plantillas/[categoria]`).

**Cupones y promociones** — cupones (porcentaje o monto fijo, vigencia, límite de usos global y por usuario, restricción por plantilla/plan/primera compra) y campañas (banner de landing + precio tachado, programables: "SANVALENTIN25 activo del 1 al 15 de feb").

**Afiliados y referidos** — solicitudes de afiliación (aprobar/rechazar), % de comisión por afiliado, dashboard de conversiones y saldo, registro de payouts (manual al inicio, con estado), enlaces/códigos generados. Referidos: configuración del incentivo doble (crédito a referente y referido).

**Blog** — editor MDX con preview, portada, tags, programación de publicación, campos SEO por post. (Motor del SEO editorial, ver doc 05.)

**SEO** — metadata por defecto, OG image por defecto, verificación Search Console, redirects gestionables (tabla `redirects` — crítico para la futura migración de dominio), toggle de indexación por tipo de página.

**Analytics** — embeds de PostHog (funnels, retención) + métricas propias: vistas de dedicatorias por día, tiempo medio, % compartidas, dispositivos. Sin duplicar una herramienta de BI: enlazar profundo a PostHog para el análisis fino.

**Configuración** — settings clave-valor tipados (tabla `settings`): textos legales, emails transaccionales (asuntos/plantillas), límites de upload por plan, precios de planes, feature flags (`ai_writer`, `marketplace`, `custom_domains`), modo mantenimiento. **Roles y permisos**: matriz módulo × acción por rol; `SUPPORT` ve usuarios/pedidos pero no configura precios; `DESIGNER` solo plantillas y categorías.

**Logs** — auditoría filtrable (usuario admin, entidad, acción, fecha) + acceso rápido a Sentry/Railway logs por deep-link.

**Backups** — estado del último backup nightly (job de GitHub Actions → R2), botón de backup manual, historial con tamaño y checksum, runbook de restauración enlazado.

### Wireframe del layout admin

```
┌────────┬──────────────────────────────────┐
│ 🧸 UWU │  Dashboard            [🔍] [👤]  │
│ ────── │ ┌───────┐┌───────┐┌───────┐      │
│ Dash   │ │Ingresos││Pedidos││Convers│ KPIs │
│ Usuari │ │ $1,240 ││  318  ││ 4.2%  │      │
│ Ventas │ └───────┘└───────┘└───────┘      │
│ Pedidos│ ┌──────────────────────────┐     │
│ Plantil│ │ 📈 ingresos 30 días       │     │
│ Categ  │ └──────────────────────────┘     │
│ Cupones│ ┌────────────┐┌─────────────┐    │
│ Afiliad│ │Top plantill││ Actividad    │    │
│ Blog   │ └────────────┘└─────────────┘    │
│ SEO    │                                  │
│ Config │  (sidebar colapsable; admin es   │
│ Logs   │   responsive pero desktop-first) │
└────────┴──────────────────────────────────┘
```
