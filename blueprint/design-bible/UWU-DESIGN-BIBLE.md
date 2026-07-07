# 📚 UWU Design Bible

> La fuente absoluta de identidad visual y de experiencia de UWU.  
> Si un diseñador o desarrollador tiene duda sobre cómo debe verse algo, la respuesta está aquí.

**Versión:** 0.1.0 · **Última actualización:** julio 2026

---

## 1. Filosofía de diseño

UWU debe sentirse como un **regalo envuelto con cuidado**: cálido, romántico, moderno y confiable. Cada pixel transmite que alguien pensó en crear algo especial para otra persona.

**Palabras clave:** romántico · suave · mágico · confiable · juguetón · premium sin ser frío

**Anti-patrones:** corporativo, minimalista frío, colores neón agresivos, tipografía genérica (Arial, Roboto), animaciones excesivas que distraen.

---

## 2. Paleta de colores

### 2.1 Colores primarios

| Token | Hex | Uso |
|-------|-----|-----|
| `--pink-50` | `#FDF2F7` | Fondos suaves |
| `--pink-100` | `#FBE4EF` | Fondos alternos, cards hover |
| `--pink-300` | `#F4A7CB` | Acentos suaves, selección texto |
| `--pink-500` | `#EE7EB1` | Logo, links, acentos primarios |
| `--pink-600` | `#E75FA0` | Hover en acentos |
| `--rose-500` | `#E8447A` | CTAs, precios, urgencia suave |

### 2.2 Colores secundarios

| Token | Hex | Uso |
|-------|-----|-----|
| `--bear-600` | `#7A4E2D` | Texto cálido, detalles osito |
| `--cream` | `#FFF9F5` | Fondo principal |
| `--night` | `#1C1420` | Fondos oscuros (plantillas) |
| `--night2` | `#2A1E2E` | Cards oscuras |
| `--ink` | `#241722` | Texto principal |
| `--muted` | `#8a6f7c` | Texto secundario |

### 2.3 Gradientes

```css
/* Hero / CTAs principales */
--grad-hero: linear-gradient(135deg, #EE7EB1 0%, #E8447A 60%, #C2418F 100%);

/* Fondo página */
--grad-page: linear-gradient(180deg, #FDF2F7 0%, #FFF9F5 40%, #FBE4EF 100%);
```

### 2.4 Colores por nivel

| Nivel | Color badge | Fondo badge | Borde |
|-------|-------------|-------------|-------|
| 🆓 Gratis | `#22C55E` | `rgba(34,197,94,0.12)` | `rgba(34,197,94,0.3)` |
| 💌 Premium | `#E8447A` | `rgba(232,68,122,0.12)` | `rgba(232,68,122,0.3)` |
| 💎 Exclusiva | `#8B5CF6` | `rgba(139,92,246,0.12)` | `rgba(139,92,246,0.3)` |

### 2.5 Prohibido

- Negro puro `#000` en textos (usar `--ink`)
- Blanco puro `#fff` en fondos grandes (usar `--cream`)
- Más de 3 colores de acento simultáneos en una pantalla
- Gradientes con más de 3 stops

---

## 3. Tipografía

### 3.1 Familias

| Familia | Uso | Google Fonts |
|---------|-----|--------------|
| **Sora** | Títulos, botones, precios, UI | `Sora:wght@600;700;800` |
| **Dancing Script** | Toques románticos, logo, firmas | `Dancing Script:wght@600;700` |
| **Inter** | Cuerpo, formularios, descripciones | `Inter:wght@400;500;600;700` |

### 3.2 Escala tipográfica

| Elemento | Familia | Tamaño | Peso | Line-height |
|----------|---------|--------|------|-------------|
| H1 hero | Sora | `clamp(2.3rem, 6.2vw, 4rem)` | 800 | 1.06 |
| H2 sección | Sora | `clamp(1.6rem, 4vw, 2.4rem)` | 800 | 1.15 |
| H3 card | Sora | `1.1rem` | 700 | 1.3 |
| Script accent | Dancing Script | `1.15em` relativo | 700 | 1.2 |
| Body | Inter | `clamp(0.95rem, 2.2vw, 1.08rem)` | 400 | 1.65 |
| Small / label | Inter | `12.5px` | 600–700 | 1.4 |
| Kicker | Inter | `12.5px` | 700 | 1.4 |
| Precio | Sora | `1rem` | 700 | 1 |
| Código | monospace | `11px` | 400 | 1.4 |

### 3.3 Kicker (etiqueta superior de sección)

```css
.kicker {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rose-500);
}
```

---

## 4. Espaciado

### 4.1 Escala base (4px)

```
4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80
```

### 4.2 Aplicación

| Contexto | Valor |
|----------|-------|
| Padding sección vertical | `56px` (móvil), `80px` (desktop) |
| Gap entre cards en grid | `16px` (móvil), `24px` (desktop) |
| Padding interno card | `24px` |
| Padding botón primario | `15px 30px` |
| Padding botón pequeño | `11px 22px` |
| Max-width contenido | `1120px` |
| Padding lateral wrap | `20px` |
| Border-radius card | `24px`–`32px` |
| Border-radius botón | `999px` (pill) |
| Border-radius input | `14px` |

---

## 5. Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `--shadow` | `0 8px 30px rgba(238,126,177,0.14)` | Cards, nav |
| `--shadow-btn` | `0 12px 34px rgba(232,68,122,0.4)` | Botón primario |
| `--shadow-btn-hover` | `0 18px 46px rgba(232,68,122,0.55)` | Botón hover |
| `--shadow-card-lg` | `0 30px 80px rgba(0,0,0,0.35)` | Plantillas / dedicatorias |
| `--shadow-phone` | `0 30px 80px rgba(122,50,90,0.4)` | Mockup dispositivo |

**Regla:** sombras siempre con tinte rosa, nunca gris neutro.

---

## 6. Botones

### 6.1 Primario

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border-radius: 999px;
  background: var(--grad-hero);
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-btn);
  transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
              box-shadow 0.25s;
}
.btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-btn-hover);
}
```

### 6.2 Ghost (secundario)

```css
.btn.ghost {
  background: rgba(255,255,255,0.72);
  color: var(--rose-500);
  border: 1px solid rgba(238,126,177,0.28);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}
```

### 6.3 Pequeño

```css
.btn.sm { padding: 11px 22px; font-size: 13.5px; }
```

### 6.4 Reglas

- Siempre con emoji opcional al inicio (💳, ✨, 👁)
- Mínimo touch target: 44×44px
- Un solo CTA primario por vista
- Disabled: opacity 0.5, sin hover, cursor not-allowed

---

## 7. Cards

### 7.1 Card de plantilla (catálogo)

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │   Arte (gradient) │  │  ← emoji grande centrado
│  │       🎀          │  │  ← gradient único por plantilla
│  └───────────────────┘  │
│  UWU-HKIT                 │  ← código plantilla (monospace pill)
│  Hello Kitty Mágica       │  ← nombre (Sora bold)
│  Sorprender               │  ← categoría (muted)
│  S/ 8.00                  │  ← precio (rose-500, Sora bold)
└─────────────────────────┘
```

- Border-radius arte: `16px` top
- Hover: `translateY(-4px)`, sombra aumentada
- Cursor pointer en toda la card

### 7.2 Card glass (checkout, modales)

```css
.card-glass {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(238,126,177,0.28);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 32px 24px;
}
```

### 7.3 Card dedicatoria (dentro de plantilla)

```css
.d-card {
  border-radius: 32px;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 36px 24px;
  max-width: 380px;
  box-shadow: var(--shadow-card-lg);
}
```

---

## 8. Categorías

### 8.1 Pill de categoría

```css
.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(238,126,177,0.28);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  transition: all 0.2s;
}
.category-pill:hover,
.category-pill.active {
  background: var(--grad-hero);
  color: #fff;
  border-color: transparent;
}
```

### 8.2 Icono de categoría

Cada categoría tiene un emoji fijo (no iconos SVG genéricos):

| Categoría | Emoji |
|-----------|-------|
| Amor | ❤️ |
| Romántica | 💌 |
| Cumpleaños | 🎂 |
| Aniversario | 💕 |
| Perdón | 🌸 |
| Extrañar | 💔 |
| Familia | 👨‍👩‍👧 |
| Mascotas | 🐶 |
| Sorprender | ✨ |
| Fechas especiales | 🎄 |
| Cerrar ciclos | 🕊️ |
| Pedida de mano | 💍 |

---

## 9. Experiencias por nivel

### 9.1 🆓 Gratis

| Aspecto | Especificación |
|---------|----------------|
| Animaciones | Básicas (fade in, float) |
| Fotos | Máx. 1 |
| Música | Solo texto (nombre canción) |
| Footer | **Marca UWU obligatoria** |
| Badge | Verde `#22C55E` — "Gratis" |
| Sensación | Bonito, funcional, invita a upgrade |

### 9.2 💌 Premium

| Aspecto | Especificación |
|---------|----------------|
| Animaciones | Intermedias (reveal, shimmer, parallax suave) |
| Fotos | Hasta 5 |
| Música | YouTube embed o texto |
| Footer | Marca UWU sutil (solo logo pequeño) |
| Badge | Rosa — "Premium" |
| Sensación | Pulido, emocional, vale la pena |

### 9.3 💎 Exclusiva

| Aspecto | Especificación |
|---------|----------------|
| Animaciones | Avanzadas (canvas, partículas, secuencias) |
| Fotos | Hasta 10 |
| Música | Spotify/YouTube embed + visualizador |
| Footer | Sin marca UWU |
| Badge | Púrpura con brillo — "Exclusiva" |
| Sensación | Wow, único, regalo inolvidable |

---

## 10. Animaciones y transiciones

### 10.1 Timing

| Tipo | Duración | Easing |
|------|----------|--------|
| Micro (hover, focus) | `0.2s`–`0.25s` | `cubic-bezier(0.22,1,0.36,1)` |
| Reveal (scroll) | `0.7s` | `cubic-bezier(0.22,1,0.36,1)` |
| Modal enter/exit | `0.3s` | spring (Framer Motion) |
| Ambient (hearts, blobs) | `6s`–`16s` | linear / alternate |

### 10.2 Reveal on scroll

```css
.rv {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.rv.on { opacity: 1; transform: none; }
/* Delays escalonados: .d1 = 0.08s, .d2 = 0.16s, .d3 = 0.24s */
```

### 10.3 Framer Motion (React)

```tsx
// Entrada estándar de componente
const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

// Modal
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};
```

### 10.4 Corazones flotantes (landing)

- Emoji: 💕, 💗, 🩷, 💖
- Animación: `floatUp` de abajo hacia arriba, 8–14s
- Opacidad máxima: 0.5
- `pointer-events: none`, `filter: blur(0.3px)`

### 10.5 Regla de oro

> Si la animación no aporta emoción, eliminarla.  
> Siempre respetar `prefers-reduced-motion: reduce`.

---

## 11. Glassmorphism

```css
--glass: rgba(255, 255, 255, 0.6);
--glass-b: 1px solid rgba(238, 126, 177, 0.28);

.glass {
  background: var(--glass);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: var(--glass-b);
}
```

**Usar en:** navbar, modales, checkout overlay, pills, badges flotantes.  
**No usar en:** textos largos, fondos de plantillas (ahí usar glass oscuro `rgba(0,0,0,0.25)`).

---

## 12. Iconos

| Contexto | Estilo |
|----------|--------|
| Categorías | Emoji nativo (no icon fonts) |
| Acciones UI | Emoji o Lucide Icons (Shadcn) |
| Redes sociales | SVG oficial (WhatsApp, Instagram, Facebook) |
| Música | 🎵 emoji o Lucide `Music` |
| QR | Lucide `QrCode` |

**Prohibido:** Font Awesome, Material Icons, iconos genéricos sin personalidad.

---

## 13. Formularios

### 13.1 Input

```css
input, textarea {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(238,126,177,0.3);
  background: rgba(255,255,255,0.8);
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: var(--ink);
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--rose-500);
  box-shadow: 0 0 0 3px rgba(232,68,122,0.15);
}
```

### 13.2 Label

```css
label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}
```

---

## 14. Responsive

### 14.1 Breakpoints

| Nombre | Min-width | Uso |
|--------|-----------|-----|
| `sm` | 420px | Nav CTA texto completo |
| `md` | 768px | Grid 2 columnas |
| `lg` | 820px | Nav links visibles |
| `xl` | 960px | Hero 2 columnas |
| `2xl` | 1120px | Max-width contenido |

### 14.2 Reglas

- Mobile-first siempre
- Catálogo: 1 col → 2 col → 3 col
- Hero: stack vertical → grid 2 cols
- Nav: hamburger no necesario (links ocultos en móvil, CTA visible)
- Touch targets mínimo 44px

---

## 15. Modales y overlays

### 15.1 Checkout overlay

```css
.chk-ov {
  position: fixed;
  inset: 0;
  background: rgba(28,20,32,0.5);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.chk-ov.open { opacity: 1; pointer-events: auto; }
```

### 15.2 Caja modal

- Max-width: `440px`
- Border-radius: `28px`
- Botón cerrar: `✕` top-right, sin fondo, opacity 0.6

---

## 16. Navegación

```
┌──────────────────────────────────────────────────────┐
│  🧸 UWU    Inicio  Catálogo  Precios  FAQ    [CTA]  │
└──────────────────────────────────────────────────────┘
```

- Barra flotante con glass effect
- Logo: Dancing Script, `--pink-500`
- Links: Inter 13.5px, weight 600
- CTA: gradient hero pill
- Sticky top, `z-index: 50`

---

## 17. Footer

```
Hecho con 🧸 por UWU · Detalles Románticos
```

- Font-size: `10px`–`12px`
- Opacity: 0.55 en plantillas, 0.8 en landing
- Centrado

---

## 18. Checklist visual

Antes de aprobar cualquier pantalla nueva:

- [ ] Usa tokens de color (no hex sueltos)
- [ ] Tipografía correcta (Sora/Inter/Dancing Script)
- [ ] Espaciado en escala de 4px
- [ ] Sombras con tinte rosa
- [ ] Border-radius consistente
- [ ] Responsive verificado
- [ ] `prefers-reduced-motion` respetado
- [ ] Un solo CTA primario
- [ ] Touch targets ≥ 44px
- [ ] Contraste WCAG AA

---

*Este documento es ley. Si hay conflicto entre este Bible y otro documento, el Bible gana.*
