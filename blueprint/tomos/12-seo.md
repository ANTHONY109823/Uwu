# 📖 Tomo XII — SEO

## Sitemap

**Ruta:** `/sitemap.xml` (generado automáticamente)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://uwu.app/</loc><priority>1.0</priority></url>
  <url><loc>https://uwu.app/catalogo</loc><priority>0.9</priority></url>
  <!-- Una URL por categoría -->
  <url><loc>https://uwu.app/catalogo/cumpleanos</loc><priority>0.8</priority></url>
  <!-- Una URL por plantilla activa -->
  <url><loc>https://uwu.app/plantilla/hello-kitty</loc><priority>0.7</priority></url>
</urlset>
```

**No incluir:** `/admin/*`, `/api/*`, dedicatorias privadas (`/d/[slug]`).

Regenerar desde admin panel o build-time en Next.js.

---

## Robots

**Ruta:** `/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /editor/
Disallow: /checkout/

Sitemap: https://uwu.app/sitemap.xml
```

---

## Open Graph

### Landing

```html
<meta property="og:title" content="UWU 🧸 — El regalo digital que nunca va a olvidar" />
<meta property="og:description" content="Crea una página web romántica con fotos, música y animaciones en menos de 5 minutos." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://uwu.app/" />
<meta property="og:image" content="https://uwu.app/og/landing.jpg" />
<meta property="og:locale" content="es_PE" />
```

### Plantilla individual

```html
<meta property="og:title" content="Hello Kitty Mágica — UWU" />
<meta property="og:description" content="Hello Kitty se dibuja sola, luego tu mensaje aparece letra por letra." />
<meta property="og:image" content="https://uwu.app/og/hello-kitty.jpg" />
```

### Dedicatoria (compartir)

Generada dinámicamente con nombre del destinatario. `noindex` en dedicatorias individuales.

---

## Metadata

| Página | title | description |
|--------|-------|-------------|
| `/` | UWU 🧸 — El regalo digital que nunca va a olvidar | Crea páginas web románticas en minutos |
| `/catalogo` | Catálogo de dedicatorias — UWU | 25+ plantillas para cada ocasión |
| `/catalogo/[cat]` | {Categoría} — UWU | Plantillas de {categoría} |
| `/plantilla/[slug]` | {Nombre} — UWU | {Descripción corta} |

Implementar con Next.js `metadata` export o `generateMetadata()`.

---

## JSON-LD

### Organización (landing)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "UWU — Detalles Románticos",
  "url": "https://uwu.app",
  "logo": "https://uwu.app/logo.png",
  "description": "Plataforma de dedicatorias web románticas"
}
```

### Producto (página de plantilla)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Hello Kitty Mágica",
  "description": "Hello Kitty se dibuja sola con corazones flotantes",
  "brand": { "@type": "Brand", "name": "UWU" },
  "offers": {
    "@type": "Offer",
    "price": "8.00",
    "priceCurrency": "PEN",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## Canonical

```html
<link rel="canonical" href="https://uwu.app/catalogo/cumpleanos" />
```

- Una canonical por página
- Sin parámetros de query en canonical
- HTTPS siempre

---

## MVP actual

`docs/index.html` ya incluye:
- `<meta name="description">`
- `og:title`, `og:description`, `og:type`

Falta: sitemap, robots, JSON-LD, canonical, OG image.
