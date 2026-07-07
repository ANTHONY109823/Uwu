# 📖 Tomo II — UX/UI

> Referencia visual absoluta: [UWU Design Bible](../design-bible/UWU-DESIGN-BIBLE.md)

## Identidad visual

UWU se siente **cálido, romántico y moderno**. No es corporativo ni genérico. Cada pantalla debe transmitir que alguien creó algo especial con amor.

**Logo:** 🧸 UWU en Dancing Script, color `--pink-500`.

---

## Colores

Ver tokens completos en Design Bible §2.

| Rol | Token | Hex |
|-----|-------|-----|
| Primario | `--pink-500` | `#EE7EB1` |
| Acento | `--rose-500` | `#E8447A` |
| Fondo | `--cream` | `#FFF9F5` |
| Texto | `--ink` | `#241722` |
| Secundario | `--muted` | `#8a6f7c` |

---

## Tipografía

| Uso | Familia |
|-----|---------|
| Títulos, botones | Sora (600–800) |
| Romántico, logo | Dancing Script (600–700) |
| Cuerpo, forms | Inter (400–700) |

---

## Componentes

### Shadcn UI (base)
Button, Card, Dialog, Input, Textarea, Select, Badge, Tabs, Sheet, Toast.

### UWU custom
| Componente | Uso |
|------------|-----|
| `TemplateCard` | Tarjeta de plantilla en catálogo |
| `CategoryPill` | Filtro de categoría |
| `LevelBadge` | Badge Gratis/Premium/Exclusiva |
| `PriceTag` | Precio formateado PEN/USD |
| `CheckoutModal` | Modal de checkout |
| `PreviewFrame` | iframe de vista previa |
| `ShareButtons` | WhatsApp, QR, copiar |
| `CurrencyToggle` | Selector PEN/USD |

---

## Espaciado

Escala 4px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80`.  
Max-width contenido: `1120px`. Padding lateral: `20px`.

---

## Responsive

| Breakpoint | Layout |
|------------|--------|
| < 420px | 1 columna, CTA corto |
| 420–768px | 1–2 columnas |
| 768–960px | 2 columnas catálogo |
| > 960px | Hero 2 cols, catálogo 3 cols |

Mobile-first. Touch targets ≥ 44px.

---

## Microanimaciones

| Animación | Duración | Uso |
|-----------|----------|-----|
| Hover botón | 0.25s | translateY(-3px) + scale(1.02) |
| Reveal scroll | 0.7s | opacity + translateY(26px) |
| Modal enter | 0.3s | scale(0.95→1) + opacity |
| Hearts float | 8–14s | floatUp en landing |
| Shimmer | 2s | Preview de plantilla |

---

## Framer Motion

```tsx
// Variantes estándar del proyecto
export const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};
```

---

## Glassmorphism

Aplicar en: navbar, modales, checkout, pills, badges.

```css
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(18px);
border: 1px solid rgba(238, 126, 177, 0.28);
```

En plantillas (fondo oscuro): `rgba(0, 0, 0, 0.25)` con `blur(16px)`.

---

## Design System completo

El Design System vive en dos lugares:

1. **Tokens CSS** → `frontend/app/globals.css` (variables)
2. **Componentes** → `frontend/components/ui/` (Shadcn) + `frontend/components/shared/` (UWU)
3. **Documentación** → [UWU-DESIGN-BIBLE.md](../design-bible/UWU-DESIGN-BIBLE.md)

### Regla
Todo componente nuevo debe usar tokens existentes. Si necesita un token nuevo, agregarlo al Bible primero.
