# 🧸 UWU — Detalles Románticos

> Crea, personaliza, paga y comparte **páginas web románticas** en minutos.

**🌸 Web en vivo:** https://anthony109823.github.io/Uwu/

## Estructura del proyecto

```
docs/
├── index.html          # Landing pública
├── admin.html          # Acceso de administrador (no enlazado en la web)
├── js/uwu.js           # Catálogo, precios, checkout y dedicatorias
├── css/dedication.css  # Estilos de páginas dedicatoria
└── d/view.html         # Visor universal de dedicatorias
```

## Flujo del usuario

```
Elegir plantilla → Personalizar → Pagar → Código + enlace + HTML descargable → Compartir 💝
```

1. El usuario elige una plantilla en la landing (cada una con **precio** y **código** propio, ej. `UWU-CTRN`).
2. Completa nombre, mensaje y canción en el checkout.
3. Al confirmar el pago recibe:
   - **Código de acceso** único (ej. `UWU-A7K2-9M4P`)
   - **Enlace en línea** (`d/view.html?slug=...`)
   - **Archivo HTML editable** para seguir personalizando offline
4. La dedicatoria se puede ver y compartir al instante.

## Catálogo

24 plantillas con códigos únicos. Precios en Soles (PEN) o Dólares (USD).

| Tipo | Ejemplos | Precio |
|---|---|---|
| Gratis | Fiesta Infinita, Lluvia de Flores, Latidos | S/ 0 |
| Premium | Carta Eterna, Nuestro Tiempo, Netflix del Amor | S/ 19.90 – 35.90 |
| Especial | La Gran Pregunta | S/ 35.90 |

## Administrador

Acceso exclusivo en `/admin.html` (no visible en la web pública):

- Editar textos de la landing en vivo
- Ocultar, reordenar o eliminar secciones
- Descargar `index.html` actualizado para publicar en GitHub

## Publicar cambios

```bash
git add .
git commit -m "tu mensaje"
git push origin main
```

GitHub Pages actualiza la web en 1–2 minutos.

---

Hecho con 🧸 por UWU · Detalles Románticos
