# 📖 Tomo XI — DevOps

## GitHub

- **Repo:** `ANTHONY109823/Uwu` (monorepo)
- **Branch principal:** `main` (producción)
- **Branch desarrollo:** `develop`
- **Features:** `feature/nombre`
- **Fixes:** `fix/nombre`
- **Releases:** `release/v1.0.0`

---

## Branches

```
main ────────────────────────────── producción
  ↑ merge (PR + CI verde)
develop ─────────────────────────── integración
  ↑ merge (PR)
feature/catalog-filters ─────────── trabajo individual
```

---

## CI/CD — GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-staging:
    needs: lint-test
    if: github.ref == 'refs/heads/develop'
    # deploy to staging

  deploy-production:
    needs: lint-test
    if: github.ref == 'refs/heads/main'
    # deploy to production
```

---

## Docker

### Desarrollo local

```bash
docker compose -f docker/docker-compose.yml up
```

Servicios: postgres (5432), backend (4000), frontend (3000).

### Producción

- Backend: Dockerfile multi-stage → Railway
- Frontend: Vercel (no Docker, build nativo)
- PostgreSQL: Railway managed

---

## Railway (Backend + BD)

| Servicio | Plan | Costo |
|----------|------|-------|
| API (NestJS) | Pro | ~$20/mes |
| PostgreSQL | Pro | incluido |

Variables en Railway dashboard. Deploy automático desde `main`.

---

## Vercel (Frontend)

| Setting | Valor |
|---------|-------|
| Framework | Next.js |
| Root | `frontend/` |
| Build | `npm run build` |
| Env | `NEXT_PUBLIC_API_URL` |

Deploy automático desde `main`. Preview deploys en PRs.

---

## Variables de entorno

### Backend (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
MERCADOPAGO_ACCESS_TOKEN=...
MERCADOPAGO_WEBHOOK_SECRET=...
MERCADOPAGO_PUBLIC_KEY=...
CORS_ORIGINS=https://uwu.app
NODE_ENV=production
PORT=4000
```

### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=https://api.uwu.app
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
```

---

## Backups

| Qué | Frecuencia | Dónde |
|-----|------------|-------|
| PostgreSQL | Diario (automático Railway) | Railway |
| pg_dump manual | Semanal | S3 / local |
| Código | Cada push | GitHub |
| Plantillas | Cada push | GitHub (templates/) |

### Restaurar BD

```bash
pg_restore -d uwu backup.dump
```

---

## Monitoreo

| Herramienta | Qué monitorea |
|-------------|---------------|
| Vercel Analytics | Frontend performance |
| Railway Metrics | CPU, memoria, logs API |
| Sentry | Errores JS y Node |
| UptimeRobot | Disponibilidad endpoints |

---

## MVP actual (GitHub Pages)

```bash
git add .
git commit -m "mensaje"
git push origin main
# GitHub Pages actualiza en 1-2 min
# URL: https://anthony109823.github.io/Uwu/
```

Se mantiene hasta que v1.0 esté en producción en dominio propio.
