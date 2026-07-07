# 📖 Tomo I — Visión del Producto

## Historia de UWU

UWU nació de una idea simple: **el mejor regalo no siempre cabe en una caja**. En un mundo donde los mensajes de texto se pierden entre notificaciones, UWU permite crear experiencias digitales románticas — páginas web personalizadas con música, fotos y animaciones — que se sienten como un regalo real.

El MVP actual (GitHub Pages) validó la demanda con 25 plantillas y un flujo de checkout funcional. La v1.0 evoluciona hacia una plataforma SaaS completa.

---

## Misión

Democratizar la creación de regalos digitales románticos, haciendo que cualquier persona pueda expresar sus sentimientos de forma creativa, personal y memorable en menos de 5 minutos.

---

## Visión

Ser la plataforma líder en Latinoamérica para dedicatorias digitales, reconocida por la calidad emocional de sus experiencias y la facilidad de uso.

---

## Objetivos

| Plazo | Objetivo | Métrica |
|-------|----------|---------|
| 3 meses | Lanzar v1.0 SaaS | 100 dedicatorias pagadas |
| 6 meses | 25 plantillas activas | 500 dedicatorias/mes |
| 12 meses | Expansión LATAM | 2,000 dedicatorias/mes |
| 24 meses | v2.0 con IA | 5,000 dedicatorias/mes |

---

## Público objetivo

### Primario
- **Edad:** 18–35 años
- **Género:** Todos (60% hombres comprando para pareja)
- **Ubicación:** Perú (inicial), LATAM
- **Ocasión:** San Valentín, aniversarios, cumpleaños, pedidas de mano
- **Comportamiento:** Usa WhatsApp/Instagram diariamente, cómodo con pagos digitales

### Secundario
- Familias (dedicatorias para mamá/papá)
- Dueños de mascotas
- Personas pidiendo perdón o cerrando ciclos

---

## Benchmark

| Competidor | Fortaleza | Debilidad | Diferenciador UWU |
|------------|-----------|-----------|-------------------|
| [Dedicapag](https://dedicapag.com) | Variedad de plantillas | UI anticuada, sin editor | Design moderno, glassmorphism |
| [Rafael Codex](https://rafaelcodex.com) | Animaciones premium | Precio alto, sin tier gratis | Tier gratis + precios accesibles |
| Canva | Herramienta general | No especializado en romance | 100% enfocado en dedicatorias |
| Story templates IG | Gratis, viral | Efímero, no personalizable | Página permanente + música + fotos |

---

## Modelo de negocio

**Tipo:** B2C — pago por dedicatoria (pay-per-use).

| Fuente de ingreso | Descripción |
|-------------------|-------------|
| Plantillas Premium (S/ 5) | Mayor volumen, margen medio |
| Plantillas Exclusivas (S/ 8) | Menor volumen, mayor margen |
| Plantillas Gratis | Adquisición (marca UWU visible) |
| Futuro: renovación/edición | S/ 3 por re-edición post 30 días |

**Costos principales:** Vercel Pro (~$20/mes), Railway Pro (~$20/mes), comisión MP (~3.99%).

---

## Estrategia de precios

| Nivel | PEN | USD | Justificación |
|-------|-----|-----|---------------|
| 🆓 Gratis | S/ 0 | $0 | Adquisición, viralidad |
| 💌 Premium | S/ 5 | $1.49 | Precio impulso (< café) |
| 💎 Exclusiva | S/ 8 | $2.49 | Experiencia wow, margen alto |

> Precio psicológico: por debajo de S/ 10 para reducir fricción de compra impulsiva.

---

## MVP

Lo indispensable para lanzar v1.0:

- [x] Landing con catálogo (MVP actual)
- [ ] Editor web funcional
- [ ] Pagos Mercado Pago
- [ ] Generación y hosting de dedicatorias
- [ ] 10 plantillas migradas
- [ ] Panel admin básico
- [ ] Compartir WhatsApp + QR

---

## Roadmap

Ver [SOFTWARE-BLUEPRINT.md §16](../SOFTWARE-BLUEPRINT.md#16-roadmap) para detalle completo.

| Versión | Foco | Fecha objetivo |
|---------|------|----------------|
| v0 (actual) | MVP estático GitHub Pages | ✅ Completado |
| v1.0 | SaaS con pagos reales | Q3 2026 |
| v1.1 | Editor avanzado, 25 plantillas | Q4 2026 |
| v2.0 | IA, i18n, PWA | Q2 2027 |
