# 📖 Tomo IV — Arquitectura

## Stack tecnológico

```
GitHub → CI/CD → Vercel Pro (Next.js) + Railway Pro (NestJS + PostgreSQL)
                        ↕ REST/JSON
                  Mercado Pago (webhooks)
```

| Capa | Tecnología | Hosting |
|------|------------|---------|
| Frontend | Next.js 15, React 19, TypeScript | Vercel Pro |
| UI | Tailwind, Shadcn UI, Framer Motion | — |
| Backend | NestJS, TypeScript | Railway Pro |
| BD | PostgreSQL 16 | Railway Pro |
| Contenedores | Docker | Railway / local |
| Pagos | Mercado Pago API | — |
| CI/CD | GitHub Actions | GitHub |
| Storage | Railway volumes / S3 | — |

---

## Diagrama de arquitectura

```
┌─────────────┐     HTTPS      ┌──────────────┐
│   Usuario   │ ──────────────▶│  Vercel CDN  │
│  (Browser)  │◀──────────────│  Next.js App │
└─────────────┘                └──────┬───────┘
                                      │ REST
                               ┌──────▼───────┐
                               │   Railway    │
                               │   NestJS     │
                               ├──────┬───────┤
                               │      │       │
                          ┌────▼──┐ ┌─▼────┐ ┌▼────────┐
                          │  PG   │ │ Docker│ │Templates│
                          └───────┘ └──────┘ └─────────┘
                               ▲
                               │ Webhook
                          ┌────┴────┐
                          │ Mercado │
                          │  Pago   │
                          └─────────┘
```

---

## Diagramas detallados

- [C4 Contexto, Contenedores, Componentes](../diagramas/c4-arquitectura.md)
- [ERD](../diagramas/erd.md)
- [UML Módulos](../diagramas/uml-modulos.md)

---

## Estructura de carpetas

Ver [SOFTWARE-BLUEPRINT §3](../SOFTWARE-BLUEPRINT.md#3-estructura-de-carpetas).

---

## Comunicación entre servicios

| Origen | Destino | Protocolo | Auth |
|--------|---------|-----------|------|
| Browser → Next.js | HTTPS | — |
| Next.js → NestJS | REST/JSON | API key interna (server-side) |
| NestJS → PostgreSQL | TCP | Connection string |
| Mercado Pago → NestJS | HTTPS POST | x-signature HMAC |
| NestJS → Mercado Pago | REST | Access token |
| GitHub Actions → Vercel/Railway | CLI/API | Deploy tokens |

---

## Docker

### docker-compose.yml (desarrollo)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: uwu
      POSTGRES_USER: uwu
      POSTGRES_PASSWORD: uwu_dev
    volumes: [pgdata:/var/lib/postgresql/data]

  backend:
    build: ./docker/Dockerfile.backend
    ports: ["4000:4000"]
    depends_on: [postgres]
    env_file: .env

  frontend:
    build: ./docker/Dockerfile.frontend
    ports: ["3000:3000"]
    depends_on: [backend]

volumes:
  pgdata:
```

---

## Escalabilidad

| Componente | Estrategia |
|------------|------------|
| Frontend | Vercel edge, ISR para catálogo |
| API | Railway horizontal scaling |
| BD | Connection pooling (PgBouncer) |
| Imágenes | CDN + WebP + lazy load |
| Plantillas | Static files, cache 1 año |

---

## Migración MVP → v1.0

| Componente actual | Destino |
|-------------------|---------|
| `docs/index.html` | `frontend/app/page.tsx` |
| `docs/js/uwu.js` | `backend` + `frontend/lib/` |
| `docs/admin.html` | `frontend/app/admin/` |
| `docs/d/*.html` | `templates/` + generador |
| `localStorage` orders | PostgreSQL `orders` + `dedications` |
| Pago simulado | Mercado Pago real |
