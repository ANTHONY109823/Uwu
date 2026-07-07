# 🗺️ Flujo de Usuario — UWU

## Flujo principal

```mermaid
flowchart TD
    A[🏠 Inicio / Landing] --> B[📂 Categorías]
    B --> C[📊 Nivel: Gratis / Premium / Exclusiva]
    C --> D[🎨 Elegir Plantilla]
    D --> E{¿Demo?}
    E -->|Sí| F[👁 Vista demo]
    F --> D
    E -->|Comprar| G[✏️ Editor]
    G --> H[👁 Vista previa]
    H --> I{¿Nivel?}
    I -->|Gratis| J[✨ Obtener gratis]
    I -->|Premium/Exclusiva| K[💳 Pago Mercado Pago]
    K --> L[🔔 Webhook confirmación]
    L --> M[⚙️ Generación HTML]
    J --> M
    M --> N[🎉 Código + Enlace + HTML]
    N --> O[📤 Compartir]
    O --> P[WhatsApp]
    O --> Q[QR]
    O --> R[Copiar enlace]
    O --> S[Descargar HTML]
```

---

## Flujo de edición posterior

```mermaid
flowchart TD
    A[🔑 Ingresar código acceso] --> B{¿Código válido?}
    B -->|No| C[❌ Error: código inválido]
    B -->|Sí| D{¿Dentro ventana edición?}
    D -->|Sí| E[✏️ Editor pre-cargado]
    D -->|No| F[💳 Renovar / nuevo pago]
    E --> G[💾 Guardar cambios]
    G --> H[⚙️ Regenerar HTML]
    H --> I[✅ Dedicatoria actualizada]
    F --> K[Flujo de pago normal]
```

---

## Flujo del administrador

```mermaid
flowchart TD
    A[/admin/login] --> B{¿Credenciales?}
    B -->|No| A
    B -->|Sí| C[📊 Dashboard]
    C --> D[🎨 Plantillas]
    C --> E[📂 Categorías]
    C --> F[💰 Ventas]
    C --> G[💝 Dedicatorias]
    C --> H[👥 Usuarios admin]
    C --> I[📈 Analytics]
    C --> J[🔍 SEO]
    C --> K[📋 Logs]
    D --> L[Crear / Editar / Activar / Eliminar]
    E --> M[CRUD categorías]
    F --> N[Ver órdenes / Reembolsos]
```

---

## Estados de una orden

```mermaid
stateDiagram-v2
    [*] --> draft: Usuario abre editor
    draft --> pending: Confirma pago
    draft --> free: Plantilla gratis
    pending --> paid: Webhook approved
    pending --> failed: Webhook rejected
    pending --> expired: Timeout 1h
    failed --> pending: Reintento
    paid --> [*]: Dedicatoria generada
    free --> [*]: Dedicatoria generada
    paid --> refunded: Reembolso admin
```

---

## Comparación MVP actual vs objetivo

| Paso | MVP (hoy) | Objetivo (v1.0) |
|------|-----------|-----------------|
| Inicio | `index.html` | Next.js `/` |
| Catálogo | Grid en landing | `/catalogo/[cat]` |
| Nivel | Badge visual (tier) | Filtro por nivel |
| Plantilla | Click → checkout modal | `/editor/[slug]` |
| Editor | Form en modal | Página completa |
| Vista previa | Demo en nueva pestaña | iframe live |
| Pago | Simulado (localStorage) | Mercado Pago |
| Webhook | No existe | NestJS handler |
| Generación | JS client-side | Backend generator |
| Compartir | Enlace + descarga HTML | WhatsApp, QR, redes |
