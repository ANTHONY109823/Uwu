# 📘 UWU — Software Blueprint

> Documento Técnico de Desarrollo oficial del proyecto UWU · Detalles Románticos  
> Versión: **0.1.0** · Estado: **Borrador activo** · Última actualización: julio 2026

---

## Propósito

Este repositorio de documentación es la **fuente de verdad** para desarrollar UWU. No es marketing: es el blueprint que guía arquitectura, diseño, APIs, base de datos, pagos y convenciones de código.

**Alcance:** ~70–100 páginas equivalentes, suficiente para construir el sistema completo sin documentación excesiva.

**Audiencia:** desarrolladores, diseñadores, IA asistente (Claude/Cursor) y futuros colaboradores.

---

## Mapa de documentos

### Documento principal

| Documento | Descripción |
|-----------|-------------|
| [SOFTWARE-BLUEPRINT.md](./SOFTWARE-BLUEPRINT.md) | **Documento maestro** — 16 capítulos con todo lo necesario para desarrollar |

### Design Bible

| Documento | Descripción |
|-----------|-------------|
| [design-bible/UWU-DESIGN-BIBLE.md](./design-bible/UWU-DESIGN-BIBLE.md) | Identidad visual absoluta: botones, cards, categorías, niveles, animaciones |

### Tomos (referencia extendida)

| Tomo | Archivo | Tema |
|------|---------|------|
| I | [tomos/01-vision-producto.md](./tomos/01-vision-producto.md) | Visión, misión, negocio, roadmap |
| II | [tomos/02-ux-ui.md](./tomos/02-ux-ui.md) | UX/UI, design system, Framer Motion |
| III | [tomos/03-funcional.md](./tomos/03-funcional.md) | Flujo completo del usuario |
| IV | [tomos/04-arquitectura.md](./tomos/04-arquitectura.md) | Stack, C4, infraestructura |
| V | [tomos/05-base-de-datos.md](./tomos/05-base-de-datos.md) | Tablas, relaciones, ERD |
| VI | [tomos/06-apis.md](./tomos/06-apis.md) | Todos los endpoints REST |
| VII | [tomos/07-panel-admin.md](./tomos/07-panel-admin.md) | Dashboard, permisos, pantallas |
| VIII | [tomos/08-editor.md](./tomos/08-editor.md) | Editor, drag & drop, media |
| IX | [tomos/09-catalogo.md](./tomos/09-catalogo.md) | Categorías, niveles, plantillas |
| X | [tomos/10-seguridad.md](./tomos/10-seguridad.md) | JWT, rate limit, webhooks |
| XI | [tomos/11-devops.md](./tomos/11-devops.md) | CI/CD, Docker, despliegue |
| XII | [tomos/12-seo.md](./tomos/12-seo.md) | Sitemap, OG, JSON-LD |
| XIII | [tomos/13-ia.md](./tomos/13-ia.md) | Funciones futuras con IA |
| XIV | [tomos/14-manual-tecnico.md](./tomos/14-manual-tecnico.md) | Cómo desplegar, actualizar, extender |

### Diagramas

| Diagrama | Archivo |
|----------|---------|
| Arquitectura C4 | [diagramas/c4-arquitectura.md](./diagramas/c4-arquitectura.md) |
| Flujo de usuario | [diagramas/flujo-usuario.md](./diagramas/flujo-usuario.md) |
| Flujo de pagos | [diagramas/flujo-pagos.md](./diagramas/flujo-pagos.md) |
| ERD | [diagramas/erd.md](./diagramas/erd.md) |
| UML | [diagramas/uml-modulos.md](./diagramas/uml-modulos.md) |

### Referencia técnica

| Recurso | Archivo |
|---------|---------|
| Esquema de BD | [database/schema.sql](./database/schema.sql) |
| API REST | [api/endpoints.md](./api/endpoints.md) |
| Reglas de desarrollo | [convenciones/reglas-desarrollo.md](./convenciones/reglas-desarrollo.md) |
| Checklist de versión | [convenciones/checklist-version.md](./convenciones/checklist-version.md) |

---

## Estado del proyecto

```
┌─────────────────────────────────────────────────────────────┐
│  HOY (MVP v0)          →    OBJETIVO (v1.0 SaaS)           │
├─────────────────────────────────────────────────────────────┤
│  GitHub Pages          →    Vercel Pro (Next.js)           │
│  HTML + JS vanilla     →    React + TypeScript             │
│  localStorage          →    PostgreSQL (Railway)             │
│  Pago simulado         →    Mercado Pago + Webhooks        │
│  admin.html local      →    Panel NestJS + JWT             │
│  25 plantillas         →    Catálogo dinámico + editor     │
└─────────────────────────────────────────────────────────────┘
```

---

## Cómo usar esta documentación

1. **Antes de codificar cualquier módulo** → leer el capítulo correspondiente en `SOFTWARE-BLUEPRINT.md`
2. **Antes de diseñar UI** → consultar `UWU-DESIGN-BIBLE.md`
3. **Antes de crear endpoints** → revisar `api/endpoints.md` y `database/schema.sql`
4. **Antes de cada release** → completar `convenciones/checklist-version.md`

---

## Versionado

| Versión doc | Versión producto | Cambios |
|-------------|------------------|---------|
| 0.1.0 | MVP v0 (GitHub Pages) | Blueprint inicial, migración planificada |

---

*Hecho con 🧸 por UWU · Detalles Románticos*
