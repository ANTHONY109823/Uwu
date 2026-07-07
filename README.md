# 🧸 UWU — Detalles Románticos

> Crea, personaliza, paga y comparte **páginas web románticas** en minutos.

**🌸 Web en vivo:** https://anthony109823.github.io/Uwu/

## Estructura del proyecto

```
uwu/
├── frontend/           # Next.js 16 — landing, catálogo, editor, checkout
├── backend/            # NestJS — API REST, pagos, generador HTML
├── templates/          # Plantillas HTML independientes
├── docs/               # MVP legacy (GitHub Pages)
├── blueprint/          # Software Blueprint oficial
├── docker/             # Docker Compose (PostgreSQL para producción)
└── package.json        # Monorepo scripts
```

### Sitio legacy (GitHub Pages)

```
docs/
├── index.html          # Landing pública
├── admin.html          # Acceso de administrador
├── js/uwu.js           # Catálogo, checkout (legacy)
└── d/view.html         # Visor de dedicatorias
```

## Arrancar en local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example backend/.env
cp .env.example frontend/.env.local   # solo NEXT_PUBLIC_API_URL

# 3. Base de datos + seed (SQLite, sin Docker)
cd backend
npx prisma db push
npm run prisma:seed

# 4. Arrancar todo
cd ..
npm run dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:4000
- **Admin:** http://localhost:3000/admin (admin@uwu.app / uwu-admin-2026)

## Flujo del usuario (v1.0)

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

25 plantillas con códigos únicos. Precios en Soles (PEN) o Dólares (USD).

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

## Documentación técnica (Software Blueprint)

El blueprint oficial del proyecto vive en [`blueprint/`](./blueprint/):

| Documento | Descripción |
|-----------|-------------|
| [Software Blueprint](./blueprint/SOFTWARE-BLUEPRINT.md) | Documento maestro de desarrollo (16 capítulos) |
| [UWU Design Bible](./blueprint/design-bible/UWU-DESIGN-BIBLE.md) | Identidad visual absoluta |
| [14 Tomos](./blueprint/tomos/) | Referencia extendida por área |
| [Diagramas](./blueprint/diagramas/) | C4, ERD, flujos, UML |
| [API](./blueprint/api/endpoints.md) | Todos los endpoints REST |
| [Base de datos](./blueprint/database/schema.sql) | Esquema PostgreSQL completo |

## Publicar cambios

```bash
git add .
git commit -m "tu mensaje"
git push origin main
```

GitHub Pages actualiza la web en 1–2 minutos.

---

Hecho con 🧸 por UWU · Detalles Románticos
