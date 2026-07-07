# 📖 Tomo III — Funcional

## Flujo completo del sistema

```
Inicio → Categorías → Nivel → Plantilla → Editor → Vista previa → Pago → Webhook → Generación → Compartir
```

Ver diagrama detallado: [diagramas/flujo-usuario.md](../diagramas/flujo-usuario.md)

---

## 1. Inicio (Landing)

**Ruta:** `/`  
**Estado MVP:** `docs/index.html`

| Elemento | Función |
|----------|---------|
| Hero | Propuesta de valor, CTA principal |
| Showcase | 10 plantillas destacadas con demo |
| Catálogo | Carrusel/grid de 25 plantillas |
| Testimonios | Social proof |
| FAQ | Preguntas frecuentes |
| Footer | Links, marca, moneda |

**Acciones:** Ver demo, comprar plantilla, cambiar moneda (PEN/USD).

---

## 2. Categorías

**Ruta objetivo:** `/catalogo`

12 categorías definidas en [SOFTWARE-BLUEPRINT §6.1](../SOFTWARE-BLUEPRINT.md#61-categorías).

El usuario filtra plantillas por ocasión emocional (Amor, Cumpleaños, Perdón, etc.).

---

## 3. Nivel

**Ruta objetivo:** `/catalogo/[categoria]/[nivel]`

| Nivel | Precio | Incluye |
|-------|--------|---------|
| 🆓 Gratis | S/ 0 | Marca UWU, básico |
| 💌 Premium | S/ 5 | Sin marca fuerte, más assets |
| 💎 Exclusiva | S/ 8 | Sin marca, efectos avanzados |

---

## 4. Plantilla

Cada plantilla muestra:
- Preview animado (gradient + emoji)
- Nombre y categoría
- Código (`UWU-XXXX`)
- Precio según moneda
- Botones: **Demo** y **Comprar**

---

## 5. Editor

**Ruta objetivo:** `/editor/[templateSlug]`

Campos dinámicos según `template_fields`:

| Campo | Tipo | Validación |
|-------|------|------------|
| Para quién | text | max 50 chars |
| Tu nombre | text | max 50 chars |
| Mensaje | textarea | max 2,000 chars |
| Canción | music | texto o URL |
| Fotos | image[] | según nivel (1/5/10) |

Auto-guardado de borrador cada 30s.

---

## 6. Vista previa

Renderizado en iframe con datos actuales del editor. Actualización en tiempo real (debounce 500ms).

**MVP actual:** abre `d/{page}.html` en nueva pestaña.  
**Objetivo:** iframe embebido en editor.

---

## 7. Pago

**Ruta objetivo:** `/checkout/[orderId]`

- Resumen: plantilla, precio, datos ingresados
- Redirección a Mercado Pago
- Return URLs: success / failure / pending

**MVP actual:** pago simulado en `processPayment()` → localStorage.

---

## 8. Webhook

`POST /api/payments/webhook` — Mercado Pago notifica resultado.

Ver: [diagramas/flujo-pagos.md](../diagramas/flujo-pagos.md)

---

## 9. Generación

Backend:
1. Carga plantilla HTML
2. Reemplaza placeholders
3. Inyecta imágenes y música
4. Agrega footer UWU si tier = free
5. Genera slug + access_code
6. Guarda en BD y storage

**Output:** URL pública + código acceso + HTML descargable.

---

## 10. Compartir

| Canal | Implementación |
|-------|----------------|
| WhatsApp | `https://wa.me/?text={mensaje}+{url}` |
| QR | Generado server-side (PNG) |
| Copiar enlace | `navigator.clipboard` |
| Descargar HTML | Blob download del HTML personalizado |
| Facebook/X | Share URLs estándar |

**MVP actual:** enlace + descarga HTML + copiar código en modal de éxito.

---

## Centro de gestión

**Ruta objetivo:** `/mis-dedicatorias`

Acceso por código `UWU-XXXX-XXXX`:
- Ver dedicatorias creadas
- Editar (dentro de ventana 30 días)
- Eliminar
- Renovar (nuevo pago)

---

## Reglas de negocio clave

1. Gratis no requiere pago ni webhook
2. Código de acceso es único e irrepetible
3. Slug público es diferente del código de acceso
4. Plantillas inactivas no aparecen en catálogo pero dedicatorias existentes siguen funcionando
5. Precios siempre calculados en backend
