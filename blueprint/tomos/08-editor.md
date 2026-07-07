# 📖 Tomo VIII — Editor

## Visión general

El editor es el corazón de UWU: donde el usuario transforma una plantilla en algo personal y único.

**Ruta:** `/editor/[templateSlug]`

---

## Layout

```
┌─────────────────────────────────────────────────┐
│  ← Volver    Hello Kitty Mágica 🎀    [Guardar]│
├────────────────────┬────────────────────────────┤
│                    │                            │
│   FORMULARIO       │     VISTA PREVIA           │
│                    │     (iframe)               │
│   Para quién       │                            │
│   Tu nombre        │     ┌──────────────┐       │
│   Mensaje          │     │  Preview en  │       │
│   Canción          │     │  tiempo real │       │
│   Fotos            │     └──────────────┘       │
│                    │                            │
├────────────────────┴────────────────────────────┤
│  Total: S/ 8.00          [💳 Continuar al pago] │
└─────────────────────────────────────────────────┘
```

En móvil: formulario arriba, preview abajo (stack vertical).

---

## Campos dinámicos

Renderizados según `template_fields` de la plantilla:

| Tipo | Componente | Validación |
|------|------------|------------|
| `text` | Input | maxLength, required |
| `textarea` | Textarea | maxLength, required |
| `image` | PhotoUploader | MIME, size, count por tier |
| `music` | MusicPicker | text/URL/Spotify/YouTube |

---

## Vista previa

- iframe apuntando a `GET /api/dedications/:id/preview`
- Actualización con debounce 500ms al cambiar campos
- Botón "Pantalla completa" para preview fullscreen
- Mismo render que la dedicatoria final

**MVP actual:** demo en nueva pestaña (`d/{page}.html`).

---

## Drag & Drop (v1.1)

- Reordenar fotos subidas
- Arrastrar secciones de texto (plantillas que lo soporten)
- Librería: `@dnd-kit/core`

---

## Carga de imágenes

### Flujo
```
1. Usuario selecciona/arrastra imagen
2. Validación client: tipo, tamaño
3. POST /api/upload (multipart)
4. Backend: valida MIME, resize, WebP, guarda
5. Retorna URL → se muestra en preview
```

### Límites por nivel

| Nivel | Máx fotos | Máx tamaño |
|-------|-----------|------------|
| Gratis | 1 | 5 MB |
| Premium | 5 | 5 MB |
| Exclusiva | 10 | 5 MB |

---

## Música

### v1.0 — Texto
Campo texto libre: "Artista — Canción". Se muestra en player visual (no reproduce).

### v1.1 — YouTube
URL de YouTube → embed en plantilla.

### v2.0 — Spotify
URL de Spotify → embed con visualizador.

```tsx
// MusicPicker
type MusicSource = 'text' | 'youtube' | 'spotify' | 'upload';
```

---

## QR (v1.1)

Generado post-creación, no en editor. Pero preview del QR disponible en paso de compartir.

---

## Auto-guardado

- Borrador guardado cada 30s via `PUT /api/dedications/:id`
- Indicador visual: "Guardado ✓" / "Guardando…"
- Recuperación si el usuario cierra y vuelve (cookie con orderId)

---

## Accesibilidad

- Labels en todos los inputs
- Focus trap en modales
- Anuncio de cambios en preview para screen readers
- Contraste WCAG AA
