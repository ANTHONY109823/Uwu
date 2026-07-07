# 📋 Checklist de Versión — UWU

Completar antes de cada release a producción.

---

## Pre-release

### Código
- [ ] Todos los PRs mergeados a `main`
- [ ] CI/CD pipeline verde (lint, test, build)
- [ ] Sin dependencias con vulnerabilidades críticas (`npm audit`)
- [ ] Variables de entorno actualizadas en Vercel y Railway
- [ ] Migraciones de BD ejecutadas en staging

### Funcional
- [ ] Flujo completo probado: catálogo → editor → pago → compartir
- [ ] Flujo gratis probado
- [ ] Webhook Mercado Pago probado (sandbox + producción)
- [ ] Panel admin accesible y funcional
- [ ] Plantillas existentes renderizan correctamente
- [ ] Descarga HTML funciona
- [ ] Compartir WhatsApp/QR funciona

### Diseño
- [ ] Design Bible respetado en pantallas nuevas/modificadas
- [ ] Responsive: móvil (375px), tablet (768px), desktop (1280px)
- [ ] `prefers-reduced-motion` verificado
- [ ] Contraste WCAG AA en textos principales

### SEO
- [ ] Meta title y description en páginas públicas
- [ ] Open Graph tags presentes
- [ ] `sitemap.xml` actualizado
- [ ] `robots.txt` correcto
- [ ] Canonical URLs configuradas

### Seguridad
- [ ] Sin secretos en código fuente
- [ ] Rate limiting activo
- [ ] CORS configurado (solo dominios permitidos)
- [ ] HTTPS forzado
- [ ] Validación de uploads (MIME, tamaño)

### Performance
- [ ] Lighthouse Performance > 80 en landing
- [ ] Imágenes optimizadas (WebP, lazy load)
- [ ] Bundle size revisado (no incremento > 10%)

### Documentación
- [ ] Software Blueprint actualizado
- [ ] Changelog escrito
- [ ] Versión bumped en `package.json`
- [ ] API endpoints documentados si hay cambios

---

## Post-release

- [ ] Verificar deploy en producción (frontend + backend)
- [ ] Smoke test en producción
- [ ] Monitorear logs primeras 2 horas
- [ ] Verificar webhook MP recibe notificaciones
- [ ] Tag de git creado (`v1.0.0`)
- [ ] Release notes publicadas en GitHub

---

## Rollback plan

Si algo falla en producción:

1. Revertir deploy en Vercel (instantáneo)
2. Revertir deploy en Railway (instantáneo)
3. Si hay migración de BD: ejecutar `down` migration
4. Comunicar en logs/admin
5. Post-mortem en 24h

---

## Historial de releases

| Versión | Fecha | Notas |
|---------|-------|-------|
| v0.1.0 | — | MVP GitHub Pages (actual) |
| v1.0.0 | — | SaaS completo (objetivo) |
