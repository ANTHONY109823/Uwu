# 03 · UX/UI, Wireframes, Navegación y Design System

> Cubre entregables: **6. UX/UI · 7. Wireframes · 8. Mapa de navegación · 15. Design System**

---

## 6. UX/UI — Principios y experiencia

### 6.1 Principios de diseño (en orden)

1. **Mobile-first radical.** El 85–95% del tráfico será móvil (descubrimiento por TikTok/IG). Se diseña en 390px y se expande a tablet/desktop/4K, nunca al revés. El destinatario SIEMPRE abre en el teléfono.
2. **La emoción es el producto.** Cada pantalla debe sentirse como un regalo: micro-momentos de delicia (corazones al hacer hover, confeti al pagar, el osito de la marca reaccionando) sin sacrificar velocidad.
3. **Cero fricción hasta el pago.** Se puede elegir plantilla, editarla y ver el preview **sin crear cuenta**. La cuenta se pide en el checkout (o se crea sola con Google en 1 tap). Cada campo de formulario innecesario mata conversión.
4. **Premium = contención.** Glassmorphism, gradientes y partículas con la disciplina de Stripe/Linear: mucho espacio en blanco, una sola fuente display, animaciones de 200–400ms con easing consistente, nunca tres efectos compitiendo.
5. **Accesible y respetuoso**: contraste AA, `prefers-reduced-motion` desactiva partículas y autoplay, targets táctiles ≥44px.

### 6.2 Los tres viajes de usuario

**A. Comprador (el viaje que paga las cuentas)**
```
TikTok/IG → Landing o directo a plantilla → ver DEMO real de la plantilla
→ "Crear la mía" → Editor con preview vivo (sin cuenta, autosave en localStorage)
→ Checkout (login con Google en 1 tap · Yape/tarjeta/MercadoPago)
→ 🎉 Éxito: enlace + QR + botones compartir → WhatsApp
Tiempo objetivo: < 5 minutos. KPI: conversión demo→pago.
```

**B. Destinatario (el viaje que hace crecer la marca)**
```
Recibe enlace → (contraseña/countdown si aplica) → experiencia a pantalla
completa con música → al final: reacción (❤️ respuesta rápida) +
"Hecho con UWU 🧸 — crea el tuyo" (discreto; ausente en planes premium top)
KPI: % de destinatarios que visitan uwu → loop viral.
```

**C. Cliente recurrente**
```
Email/notificación ("tu aniversario se acerca") → Panel → duplicar/crear
→ pagar con método guardado. KPI: compras repetidas/año.
```

### 6.3 El editor (la pantalla más importante del producto)

- **Layout móvil**: preview arriba (marco de teléfono, 60% de la pantalla), panel de edición como bottom-sheet con tabs: `Textos · Fotos · Música · Extras · Estilo`.
- **Layout desktop**: panel izquierdo de edición (400px) + preview centrado en marco de dispositivo con toggle móvil/desktop.
- El formulario **se autogenera del schema Zod de la plantilla** (ver doc 02 §5.3): cada plantilla expone solo sus campos.
- Autosave continuo (localStorage anónimo → BD al tener cuenta). Nunca se pierde trabajo.
- Extras premium visibles pero bloqueados con 🔒 y upsell contextual ("Añade contraseña — incluido en Llama").
- Botón flotante permanente: **«Ver como lo verá 💝»** → preview a pantalla completa real, con música.

---

## 7. Wireframes (anotados, mobile-first)

### 7.1 Landing (`/`)

```
┌─────────────────────────┐
│ 🧸 UWU        [Entrar]  │ ← header glass, fijo, blur al scroll
├─────────────────────────┤
│   ✨ partículas/corazones│
│  El regalo digital que  │ ← H1 display + gradiente rosa
│  nunca va a olvidar     │
│  [Crear mi dedicatoria] │ ← CTA primario (gradiente, glow suave)
│  [Ver demo ▶]           │ ← abre demo real de plantilla, no video fake
│  ┌───────────────────┐  │
│  │ 📱 mock teléfono   │  │ ← dedicatoria demo ANIMADA en vivo (autoplay
│  │  con demo en vivo  │  │    muted) = el "video de demostración"
│  └───────────────────┘  │
├─────────────────────────┤
│ ¿Cómo funciona? (3 pasos│ ← scroll-reveal: Elige → Personaliza → Comparte
│  con micro-animaciones) │
├─────────────────────────┤
│ Categorías (grid 2×n,   │ ← cada tarjeta con gradiente/emoji propio
│  chips con emoji)       │
├─────────────────────────┤
│ Plantillas destacadas   │ ← carrusel; cada card = mini-preview animado
│  [card][card][card] →   │    + tier + precio + "Ver demo"
├─────────────────────────┤
│ Beneficios (4 bloques)  │ ← instantáneo · premium · medible · tuyo
│ Testimonios (carrusel)  │ ← estilo captura-de-WhatsApp (formato nativo
│ Precios (3 cards)       │    del nicho) · plan Llama destacado
│ FAQ (accordion)         │
│ CTA final + footer      │ ← footer: legal, redes, "hecho con 🧸"
└─────────────────────────┘
```

### 7.2 Catálogo (`/plantillas`)

```
┌─────────────────────────┐
│ ← Plantillas    [🔍]    │
│ [❤️Enamorar][🎂Cumple].. │ ← chips scroll horizontal (categorías)
│ [Todas|Gratis|Premium]  │ ← filtro tier
│ ┌─────────┐ ┌─────────┐ │
│ │ preview │ │ preview │ │ ← grid 2 col móvil / 4 desktop
│ │ animado │ │ (hover=  │ │   card: nombre, tier badge, precio,
│ │ $3.99 💎│ │  demo)   │ │   corazón (guardar)
│ └─────────┘ └─────────┘ │
└─────────────────────────┘
Detalle de plantilla: demo interactiva a pantalla completa + botón fijo
inferior [Personalizar esta plantilla →] + features incluidas + plantillas similares.
```

### 7.3 Editor (`/crear/[plantilla]`) — ver §6.3

```
┌─────────────────────────┐
│ ✕  Carta Eterna   [👁️ ] │
│ ┌─────────────────────┐ │
│ │   📱 PREVIEW VIVO    │ │ ← render real de la plantilla, actualiza
│ │   (marco teléfono)   │ │    con cada tecla (debounced)
│ └─────────────────────┘ │
│ ╭─────────────────────╮ │
│ │Textos·Fotos·Música·⚙│ │ ← bottom-sheet con tabs (draggable)
│ │ Para: [___________] │ │
│ │ Mensaje: [________] │ │ ← (v2: botón ✨ IA sugiere)
│ │ 🔒 Contraseña  🔒Pro │ │
│ ╰─────────────────────╯ │
│ [Continuar → $3.99]     │ ← CTA fijo con precio siempre visible
└─────────────────────────┘
```

### 7.4 Checkout y éxito

```
Checkout: resumen (mini-preview + plantilla + plan) → cupón →
métodos de pago con logos locales (Yape/Plin/tarjetas/MercadoPago)
→ [Pagar $3.99] → Google login 1-tap si no hay sesión.
UNA sola pantalla. Sin pasos múltiples.

Éxito: 🎉 confeti → "¡Tu dedicatoria está viva!" → enlace copiable
→ QR (descargar) → [WhatsApp][Instagram][TikTok][Copiar]
→ "administrala desde tu panel" (soft onboarding al panel)
```

### 7.5 La dedicatoria (`/d/[slug]`) — la experiencia

```
Portada de entrada (branding mínimo) → [tap para abrir 💌]
(el tap habilita el audio: requisito de autoplay de iOS/Android)
→ experiencia de la plantilla a pantalla completa
→ controles flotantes discretos: 🔊 · pausa
→ final: reacción del destinatario + firma "Hecho con UWU 🧸" (según plan)
Si tiene contraseña: pantalla de candado romántica antes de abrir.
Si tiene countdown: pantalla de cuenta regresiva hasta la fecha.
```

### 7.6 Paneles — wireframes en doc 04.

---

## 8. Mapa de navegación

```
/                               Landing
/plantillas                     Catálogo (filtros por query: ?categoria=&tier=)
/plantillas/[categoria]         Catálogo filtrado (SEO: página por categoría)
/plantillas/[categoria]/[slug]  Detalle + demo de plantilla
/crear/[templateSlug]           Editor (draft anónimo o de usuario)
/pagar/[dedicationId]           Checkout
/exito/[orderId]                Confirmación + compartir
/d/[slug]                       💝 Dedicatoria publicada (ISR)
/precios · /faq · /blog/[slug] · /legal/{terminos,privacidad}
/entrar · /registro · /recuperar

/panel                          ┐ Panel cliente (auth)
/panel/dedicatorias[/id/…]      │ lista · editar · stats · compartir
/panel/pedidos · /panel/cuenta  ┘ · /panel/referidos

/admin                          ┐ Panel admin (role ADMIN, layout propio)
/admin/{usuarios,ventas,pedidos,│
 plantillas,categorias,cupones, │ ver doc 04
 afiliados,blog,seo,analytics,  │
 configuracion,logs}            ┘
```

Reglas: URLs en español (SEO + mercado); breadcrumbs en catálogo; el editor y `/d/` sin navegación global (inmersión); redirect post-login inteligente (vuelve a donde estabas, crítico en checkout).

---

## 15. Design System — "UWU DS"

Vive en `packages/ui` + preset Tailwind en `packages/config`. Base: **shadcn/ui** re-tematizado (se posee el código, cero lock-in) + Framer Motion.

### 15.1 Identidad — derivada del logotipo

El logo define la paleta: círculo rosa pastel, script rosa medio, osito café, moño rojo-coral, corazones.

```
Colores de marca (tokens):
  --uwu-pink-50:  #FDF2F7   fondo de secciones suaves (círculo del logo)
  --uwu-pink-100: #FBE4EF   superficies rosadas
  --uwu-pink-300: #F4A7CB   acentos secundarios
  --uwu-pink-500: #EE7EB1   PRIMARIO (el "Uwu" del logo)
  --uwu-pink-600: #E75FA0   hover/pressed
  --uwu-rose-500: #E8447A   CTA fuerte, precios, badges premium (moño)
  --uwu-bear-400: #A9744B   café claro (osito) — ilustración
  --uwu-bear-600: #7A4E2D   café oscuro — texto sobre rosa claro
  --uwu-cream:    #FFF9F5   fondo base cálido (modo claro)
  --uwu-night:    #1C1420   fondo modo oscuro (morado-rosado profundo, no negro)
  --uwu-night-2:  #2A1E2E   superficies modo oscuro

Gradientes de marca:
  --grad-hero:    linear-gradient(135deg,#EE7EB1 0%,#E8447A 60%,#C2418F 100%)
  --grad-soft:    linear-gradient(180deg,#FDF2F7,#FFF9F5)
  --grad-glass:   rgba(255,255,255,.55) + backdrop-blur(16px) + borde rgba(238,126,177,.25)

Semánticos: success #22C55E · warning #F59E0B · error #EF4444 · info #6366F1
```

Regla: los colores de marca visten **la plataforma**; cada plantilla de dedicatoria define su propia paleta interna (una plantilla "Netflix" es negra y roja) — el DS gobierna el chrome, no el arte.

### 15.2 Tipografía

| Rol | Fuente | Uso |
|---|---|---|
| Display romántico | **Dancing Script** (o Great Vibes) | Solo logo-lockups y titulares hero. Nunca en párrafos ni UI. |
| Headings UI | **Sora** | H1–H4, números, precios |
| Cuerpo | **Inter** | Todo lo demás; `next/font` self-hosted |

Escala: 12·14·16·18·20·24·30·36·48·60·72 (rem, fluid con clamp() en hero).

### 15.3 Fundaciones

- **Espaciado**: escala Tailwind (4px base). Secciones landing: py-24 móvil / py-32 desktop.
- **Radios**: `rounded-2xl` (16px) por defecto en cards; `rounded-full` en chips/CTA pills. UWU es redondo, jamás esquinas duras.
- **Sombras**: suaves y rosadas — `shadow-[0_8px_30px_rgba(238,126,177,0.15)]`; glow en CTAs.
- **Glass**: token único `--grad-glass` (ver 15.1); usar en header, modales y cards sobre fondos con gradiente. Máximo 2 niveles de glass superpuestos.
- **Modo oscuro**: class strategy de Tailwind; fondos `night`, los rosas suben saturación; conmutable en plataforma Y por dedicatoria (el creador elige el tema de su página).

### 15.4 Movimiento (Framer Motion — reglas estrictas)

```
Duraciones: micro 150ms · UI 250ms · entradas 400ms · hero 700ms
Easing: [0.22, 1, 0.36, 1] (easeOutQuint suave) — ÚNICO easing global
Patrones: fadeUp (opacity+y:12) para scroll-reveal (viewport once)
          scale 0.97→1 en cards hover · stagger 60ms en grids
Corazones flotantes: canvas, máx 20 partículas móvil/40 desktop,
          pausa fuera de viewport, OFF con prefers-reduced-motion
Confeti: solo en /exito y momentos de celebración (1 vez, no loop)
```

### 15.5 Componentes (`packages/ui`)

**Base (shadcn re-tematizado):** Button (primary gradiente · secondary · ghost · premium con 💎), Input/Textarea/Select, Dialog/Sheet/Drawer, Tabs, Accordion, Badge, Toast, Skeleton, Avatar, Tooltip, Card.

**De dominio:**
- `TemplateCard` — preview animado en hover, tier badge, precio, corazón guardar
- `PhoneFrame` — marco de dispositivo del preview (editor, catálogo, landing)
- `CategoryChip` — emoji + gradiente propio por categoría (los 15 gradientes definidos como tokens `--cat-*`)
- `PriceCard` · `TestimonialCard` (estilo WhatsApp) · `FaqItem`
- `ShareBar` (WhatsApp/IG/TikTok/copy/QR) · `QrCard`
- `MusicPicker` (subir/YouTube/Spotify/SoundCloud/biblioteca) · `AudioPlayer` flotante
- `CountdownTimer` · `RelationshipCounter` · `PasswordGate`
- `StatsSparkline` · `EmptyState` (con el osito 🧸) · `UwuLogo`

**Documentación viva**: Storybook en `packages/ui` (deploy como preview de Vercel) — cada componente con variantes claro/oscuro y móvil/desktop. Es el contrato visual del proyecto y acelera crear plantillas nuevas.

### 15.6 Voz y microcopy

Cálida, juguetona, jamás cursi-empalagosa en la UI (la cursilería es contenido del usuario, no del sistema). Tuteo siempre. Emojis con moderación estratégica (🧸💝✨). Errores amables: «Ups, esa foto pesa mucho 🙈 — prueba con una menor a 10MB». CTAs en primera persona: «Crear mi dedicatoria».
