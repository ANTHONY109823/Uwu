# 📖 Tomo XIV — Manual Técnico

## Cómo desplegar

### MVP actual (GitHub Pages)

```bash
cd C:\Uwu
git add .
git commit -m "tu mensaje"
git push origin main
# Esperar 1-2 min → https://anthony109823.github.io/Uwu/
```

### v1.0 (producción)

```bash
# 1. Variables de entorno configuradas en Vercel y Railway
# 2. Push a main
git push origin main
# 3. GitHub Actions ejecuta CI → deploy automático
# 4. Verificar:
curl https://api.uwu.app/health
curl https://uwu.app
```

### Desarrollo local

```bash
# Clonar
git clone https://github.com/ANTHONY109823/Uwu.git
cd Uwu

# Levantar BD + backend + frontend
docker compose -f docker/docker-compose.yml up

# O por separado:
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev
```

---

## Cómo actualizar

### Actualizar dependencias

```bash
npm update
npm audit fix
# Verificar que tests pasan
npm test
```

### Migración de BD

```bash
cd backend
npx prisma migrate dev --name descripcion_cambio
npx prisma db seed  # si hay nuevos seeds
```

### Actualizar plantilla existente

1. Editar archivos en `templates/{slug}/`
2. Ejecutar `npm run template:validate {slug}`
3. Si cambió metadata, actualizar en admin panel o seed
4. Deploy → las nuevas dedicatorias usan la versión nueva
5. Dedicatorias existentes mantienen HTML generado original

---

## Cómo crear nuevas plantillas

### Paso 1: Copiar base

```bash
cp -r templates/_base templates/mi-plantilla
```

### Paso 2: Configurar metadata

Editar `templates/mi-plantilla/template.json`:

```json
{
  "slug": "mi-plantilla",
  "code": "UWU-MIPL",
  "name": "Mi Plantilla",
  "emoji": "💝",
  "category": "amor",
  "tier": "premium",
  "price": { "pen": "5.00", "usd": "1.49" },
  "fields": [
    { "key": "para", "type": "text", "label": "Para quién", "maxLength": 50 },
    { "key": "de", "type": "text", "label": "Tu nombre", "maxLength": 50 },
    { "key": "mensaje", "type": "textarea", "label": "Mensaje", "maxLength": 2000 },
    { "key": "cancion", "type": "music", "label": "Canción" }
  ],
  "placeholders": ["__UWU_MSG__", "__UWU_SUBTITLE__", "__UWU_CODE__"]
}
```

### Paso 3: Diseñar HTML

Editar `index.html` usando placeholders estándar. Seguir [Design Bible](../design-bible/UWU-DESIGN-BIBLE.md).

### Paso 4: Validar

```bash
npm run template:validate mi-plantilla
```

Verifica: placeholders presentes, responsive, reduced-motion, footer si free.

### Paso 5: Seed

Agregar a `database/seeds/templates.ts` y ejecutar seed.

### Paso 6: Documentar

Actualizar [Tomo IX](./09-catalogo.md) con la nueva entrada.

---

## Cómo agregar categorías

1. Insertar en BD:
```sql
INSERT INTO categories (slug, name, emoji, sort_order)
VALUES ('nueva-cat', 'Nueva Categoría', '🌟', 13);
```

2. Crear ruta en frontend: `app/catalogo/nueva-cat/page.tsx`
3. Agregar emoji en Design Bible §8.2
4. Actualizar sitemap
5. Actualizar Tomo IX

---

## Cómo administrar el sistema

### Acceso admin

1. Ir a `https://uwu.app/admin/login` (no enlazado públicamente)
2. Login con credenciales de `admin_users`
3. Dashboard muestra métricas en tiempo real

### Tareas frecuentes

| Tarea | Dónde | Quién |
|-------|-------|-------|
| Activar/desactivar plantilla | Admin → Plantillas | editor |
| Cambiar precio de nivel | Admin → Configuración | superadmin |
| Moderar dedicatoria | Admin → Dedicatorias | support |
| Ver ventas del día | Admin → Dashboard | analyst |
| Reembolsar orden | Admin → Ventas | superadmin |
| Regenerar sitemap | Admin → SEO | editor |

### Crear admin user

```bash
cd backend
npx ts-node scripts/create-admin.ts --email admin@uwu.app --role superadmin
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Webhook MP no llega | Verificar URL en dashboard MP, revisar logs Railway |
| Dedicatoria no genera | Revisar `orders` status, ejecutar cron regeneración |
| Preview no carga | Verificar CORS, iframe same-origin policy |
| Pago aprobado sin dedicatoria | Buscar en `payments` approved + `dedications` null, reintentar |
| GitHub Pages no actualiza | Verificar branch `main`, Settings → Pages → source |

---

## Contacto técnico

- **Repo:** [github.com/ANTHONY109823/Uwu](https://github.com/ANTHONY109823/Uwu)
- **Blueprint:** `blueprint/` en el repo
- **Web MVP:** [anthony109823.github.io/Uwu](https://anthony109823.github.io/Uwu/)
