# 📐 Reglas de Desarrollo — UWU

> Instrucciones obligatorias para desarrolladores y asistentes IA (Claude, Cursor).

---

## Principios fundamentales

### 1. No duplicar código
Si una lógica aparece en 2+ lugares, extraer a:
- **Frontend:** `lib/`, `hooks/`, `components/shared/`
- **Backend:** `common/`, servicios compartidos en `modules/`

### 2. Componentes reutilizables
```
components/
├── ui/          ← Shadcn UI (Button, Card, Dialog…)
├── shared/      ← UWU-specific reusables (PriceTag, LevelBadge)
└── {module}/    ← Componentes de dominio (catalog/, editor/)
```

### 3. CSS sin repetición
- Usar **Tailwind CSS** con tokens del Design Bible.
- CSS custom solo en plantillas (`templates/*/styles.css`).
- Prohibido: copiar bloques de estilos entre componentes React.

### 4. Modularidad
Cada feature = un módulo NestJS independiente:
```
backend/src/modules/
├── catalog/       # Categorías y plantillas
├── dedications/   # CRUD dedicatorias
├── payments/      # Mercado Pago
├── generator/     # HTML builder
└── admin/         # Panel admin
```

### 5. Plantillas independientes
- Cada plantilla vive en `templates/{slug}/`.
- Puede tener CSS/JS propio.
- Solo depende de `_base/` para placeholders y validación.
- **Nunca** importar lógica de otra plantilla.

### 6. Lógica de negocio en backend
| ✅ Backend | ❌ Frontend |
|-----------|------------|
| Calcular precios | Mostrar precio recibido |
| Validar códigos | Solo input UX validation |
| Generar HTML | Solo preview en iframe |
| Procesar pagos | Solo redirigir a MP |
| Rate limiting | — |

### 7. Sin secretos en frontend
```typescript
// ❌ PROHIBIDO
const MP_TOKEN = "APP_USR-xxx";

// ✅ CORRECTO
// Token solo en backend process.env.MERCADOPAGO_ACCESS_TOKEN
// Frontend recibe solo initPoint público
```

### 8. Compatibilidad
- Cambios breaking → nueva versión API (`/api/v2/`).
- Deprecar con header `Sunset` y 90 días de gracia.
- Migraciones de BD siempre reversibles.

### 9. Documentar antes de implementar
Antes de escribir código:
1. Leer capítulo relevante del Software Blueprint.
2. Si el módulo es nuevo, agregar sección al blueprint.
3. Actualizar `api/endpoints.md` si hay endpoints nuevos.

### 10. Tests obligatorios

| Módulo | Tipo | Mínimo |
|--------|------|--------|
| Pagos | e2e | Crear preferencia, webhook, estados |
| Generador | unit | Placeholders, footer free, slug único |
| Auth admin | e2e | Login, JWT expiry, RBAC |
| Upload | unit | MIME validation, size limit |

---

## Convenciones de nombres

| Contexto | Estilo | Ejemplo |
|----------|--------|---------|
| React componentes | PascalCase | `TemplateCard` |
| Archivos componente | PascalCase.tsx | `TemplateCard.tsx` |
| Hooks | use + PascalCase | `useCatalog` |
| Funciones utilidad | camelCase | `formatPrice` |
| Constantes | UPPER_SNAKE | `MAX_PHOTOS` |
| API endpoints | kebab-case | `/api/by-code` |
| BD tablas | snake_case | `dedication_images` |
| BD columnas | snake_case | `access_code` |
| Enums TS | PascalCase | `PaymentStatus` |
| Env vars | UPPER_SNAKE | `DATABASE_URL` |
| CSS variables | kebab-case | `--pink-500` |
| Template slugs | kebab-case | `hello-kitty` |
| Template codes | UPPER | `UWU-HKIT` |

---

## Estructura de commits

```
tipo(scope): descripción breve

feat(catalog): add level filter to template grid
fix(payments): handle duplicate webhook notifications
docs(blueprint): update ERD with visits table
refactor(editor): extract PhotoUploader component
test(generator): add placeholder replacement tests
```

**Tipos:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

---

## Flujo de trabajo

```
1. Leer blueprint del módulo
2. Crear branch feature/nombre-descriptivo
3. Implementar con tests
4. Actualizar documentación si aplica
5. PR → develop → CI verde → review
6. Merge → staging → QA manual
7. Release → main → deploy automático
```

---

## Checklist pre-PR

- [ ] Sin secretos hardcodeados
- [ ] Sin `console.log` de debug
- [ ] Tipos TypeScript estrictos (no `any`)
- [ ] Responsive verificado (375px, 768px, 1280px)
- [ ] `prefers-reduced-motion` respetado
- [ ] Errores con mensajes amigables en español
- [ ] Documentación actualizada si hay cambios de API/BD

---

*Estas reglas son innegociables. Cualquier excepción requiere aprobación explícita y documentación de la razón.*
