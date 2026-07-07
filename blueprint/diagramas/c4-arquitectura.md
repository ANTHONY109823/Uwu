# 🏗️ Arquitectura C4 — UWU

## Nivel 1: Contexto

```mermaid
C4Context
  title Diagrama de Contexto — UWU

  Person(usuario, "Usuario", "Crea y comparte dedicatorias románticas")
  Person(admin, "Administrador", "Gestiona catálogo, ventas y contenido")
  Person(destinatario, "Destinatario", "Recibe y ve la dedicatoria")

  System(uwu, "UWU Platform", "Plataforma SaaS de dedicatorias web románticas")
  System_Ext(mp, "Mercado Pago", "Procesamiento de pagos PEN/USD")
  System_Ext(github, "GitHub", "Repositorio y CI/CD")
  System_Ext(cdn, "CDN / Storage", "Assets estáticos e imágenes")

  Rel(usuario, uwu, "Crea, personaliza, paga")
  Rel(destinatario, uwu, "Ve dedicatoria")
  Rel(admin, uwu, "Administra")
  Rel(uwu, mp, "Procesa pagos")
  Rel(uwu, cdn, "Sirve assets")
  Rel(github, uwu, "Deploy automático")
```

---

## Nivel 2: Contenedores

```mermaid
C4Container
  title Diagrama de Contenedores — UWU

  Person(usuario, "Usuario")

  Container_Boundary(uwu, "UWU Platform") {
    Container(web, "Web App", "Next.js 15, React, TypeScript", "Landing, catálogo, editor, checkout")
    Container(api, "API Server", "NestJS, TypeScript", "Lógica de negocio, pagos, generación")
    ContainerDb(db, "PostgreSQL", "PostgreSQL 16", "Datos persistentes")
    Container(templates, "Template Store", "HTML/CSS/JS", "Plantillas independientes")
  }

  System_Ext(mp, "Mercado Pago")
  System_Ext(vercel, "Vercel", "Hosting frontend")
  System_Ext(railway, "Railway", "Hosting backend + BD")

  Rel(usuario, web, "HTTPS")
  Rel(web, api, "REST/JSON")
  Rel(api, db, "Prisma ORM")
  Rel(api, templates, "Lee plantillas")
  Rel(api, mp, "API + Webhooks")
  Rel(vercel, web, "Deploy")
  Rel(railway, api, "Deploy")
  Rel(railway, db, "Managed")
```

---

## Nivel 3: Componentes — API Server

```mermaid
C4Component
  title Componentes del Backend (NestJS)

  Container_Boundary(api, "API Server") {
    Component(auth, "Auth Module", "JWT admin, código acceso")
    Component(catalog, "Catalog Module", "Categorías y plantillas")
    Component(dedications, "Dedications Module", "CRUD dedicatorias")
    Component(payments, "Payments Module", "Mercado Pago integration")
    Component(generator, "Generator Module", "HTML builder")
    Component(upload, "Upload Module", "Imágenes y archivos")
    Component(admin, "Admin Module", "Dashboard, analytics")
    Component(analytics, "Analytics Module", "Visitas y métricas")
  }

  ContainerDb(db, "PostgreSQL")
  System_Ext(mp, "Mercado Pago")

  Rel(catalog, db, "Lee")
  Rel(dedications, db, "CRUD")
  Rel(payments, mp, "Preferencias + webhooks")
  Rel(payments, dedications, "Trigger generación")
  Rel(generator, dedications, "Crea HTML")
  Rel(upload, db, "Metadata imágenes")
  Rel(admin, db, "Gestión")
  Rel(analytics, db, "Agrega visitas")
  Rel(auth, admin, "Protege rutas")
```

---

## Nivel 3: Componentes — Frontend

```mermaid
C4Component
  title Componentes del Frontend (Next.js)

  Container_Boundary(web, "Web App") {
    Component(landing, "Landing Page", "Hero, showcase, FAQ")
    Component(catalog, "Catalog", "Grid, filtros, búsqueda")
    Component(editor, "Editor", "Formulario dinámico, preview")
    Component(checkout, "Checkout", "Resumen, pago MP")
    Component(viewer, "Dedication Viewer", "Página pública /d/[slug]")
    Component(share, "Share Module", "WhatsApp, QR, copiar")
    Component(adminUI, "Admin Panel", "Dashboard, CRUD")
  }

  Container(api, "API Server")

  Rel(landing, api, "GET categories, templates")
  Rel(catalog, api, "GET templates")
  Rel(editor, api, "POST/PUT draft, upload")
  Rel(checkout, api, "POST payment")
  Rel(viewer, api, "GET dedication")
  Rel(share, api, "GET QR, share links")
  Rel(adminUI, api, "Admin CRUD")
```

---

## Despliegue

```
GitHub (push main)
      │
      ▼
GitHub Actions (CI)
  ├── lint + test + build
  ├── docker build backend
  └── deploy
      ├── Vercel ← frontend/
      └── Railway ← backend/ + PostgreSQL
```
