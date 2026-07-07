# 01 · Análisis de Mercado y Negocio

> Cubre entregables: **1. Análisis de competencia · 2. Investigación de mercado · 3. Propuesta de valor · 4. Modelo de negocio**

---

## 1. Análisis de la competencia

> ⚠️ **Nota metodológica**: las dos referencias (`rafael-codex-exclusive-codes-prm.netlify.app` y `dedicapag.com/templates`) bloquean el análisis automatizado (SPA sin SSR y HTTP 403 respectivamente). El análisis se basa en el patrón de mercado de esta categoría de producto, que está muy estandarizado, y debe validarse con una revisión manual de ambos sitios. Los puntos marcados con ✱ son inferencias de categoría, no observaciones directas.

### 1.1 Competidor tipo A — Vendedores de "códigos" (perfil rafael-codex)

Modelo: venden el **código fuente HTML/CSS/JS** de páginas románticas (Netflix-style, Spotify-style, cartas animadas) para que el comprador lo despliegue por su cuenta o el vendedor lo suba manualmente a Netlify/Vercel.

| Fortalezas | Debilidades (nuestras oportunidades) |
|---|---|
| Plantillas visualmente llamativas y virales (formato TikTok) ✱ | **Proceso 100% manual**: el comprador contacta por WhatsApp, paga por transferencia/Yape, y espera horas o días ✱ |
| Precios bajos, accesibles al público joven ✱ | Sin personalización self-service: cambios = pedirlos al vendedor ✱ |
| Marketing orgánico fuerte en TikTok/Instagram ✱ | Sin panel de cliente, sin edición posterior, sin estadísticas ✱ |
| Costo operativo casi nulo | El sitio en sí es una SPA sin SSR: **SEO nulo** (verificado: la página no renderiza contenido sin JS) |
| | No escala: cada venta consume tiempo humano del vendedor |
| | Sin recurrencia: venta única, sin suscripción ni upsell |

### 1.2 Competidor tipo B — Plataformas semi-automatizadas (perfil dedicapag)

Modelo: catálogo de plantillas con formulario de personalización y pago en línea; la página se genera con distintos grados de automatización.

| Fortalezas | Debilidades (nuestras oportunidades) |
|---|---|
| Catálogo organizado por ocasión ✱ | Personalización limitada a rellenar campos: sin preview en tiempo real fiel ✱ |
| Pago en línea integrado ✱ | Plantillas que son variaciones de color de una misma base ✱ |
| Generación más rápida que el tipo A ✱ | Sin cuenta de usuario / panel: perdiste el enlace, perdiste el regalo ✱ |
| Marca reconocible en el nicho ✱ | Sin estadísticas para el comprador (¿la vio? ¿cuántas veces?) ✱ |
| | Multimedia limitada: rara vez soportan Spotify embed, video, contraseña, countdown en una misma página ✱ |
| | Sin programa de afiliados ni motor de crecimiento estructural ✱ |

### 1.3 Competidores indirectos

- **Canva / CapCut**: la gente hace collages o videos como regalo. No generan una *experiencia web interactiva* ni un enlace permanente.
- **LoveBox / regalos físicos personalizados**: precio 10–20× mayor, logística, sin inmediatez.
- **Hacerlo uno mismo (dev novato + Vercel)**: solo viable para el ~1% técnico; nuestro mercado es el 99% restante.

### 1.4 Conclusión competitiva

Nadie en el nicho hispanohablante combina hoy: **self-service total + preview en tiempo real + generación instantánea post-pago + panel de cliente + estadísticas + calidad de diseño nivel Stripe/Framer**. Esa combinación es exactamente la definición de UWU. La barrera de entrada del nicho es baja (por eso hay muchos vendedores tipo A), pero la barrera para construir *la plataforma* es alta — y esa es la jugada.

---

## 2. Investigación del mercado

### 2.1 Tamaño y dinámica

- **Mercado primario**: hispanohablantes de 16–35 años en LatAm (México, Perú, Colombia, Argentina, Chile, Ecuador) + hispanos en EE.UU. Población objetivo digitalmente activa estimada en el rango de decenas de millones; incluso una penetración marginal sostiene el negocio.
- **Comportamiento**: el regalo digital romántico es un fenómeno nativo de TikTok. Los picos de demanda son brutalmente estacionales:
  - **San Valentín (14 feb)** — pico absoluto del año (semanas 5–7).
  - Día de la Madre/Padre, aniversarios (distribuidos), cumpleaños (constante todo el año), Navidad/Año Nuevo, Día del Amor y la Amistad (Colombia, septiembre).
- **Ticket**: el público paga entre **US$2 y US$10** por una dedicatoria única; los vendedores informales del nicho ya validaron ese rango. Es un gasto impulsivo, emocional, de baja fricción — perfecto para checkout de un solo paso.
- **Canal de descubrimiento dominante**: TikTok e Instagram Reels ("mira lo que le hice a mi novio"). El producto **se demuestra a sí mismo**: cada dedicatoria compartida es un anuncio.

### 2.2 Insight clave del mercado

El comprador no está comprando una página web. Está comprando **el momento en que la otra persona abre el enlace y reacciona**. Por eso importan desproporcionadamente: la música que arranca al abrir, la animación de entrada, la sorpresa (contraseña, countdown), y que se vea perfecta *en el teléfono del destinatario*. Mobile-first no es una preferencia técnica: es el requisito #1 del producto.

### 2.3 Riesgos de mercado

| Riesgo | Mitigación |
|---|---|
| Estacionalidad extrema (San Valentín) | 15 categorías que cubren todo el año (cumpleaños, perdón, familia, mascotas, despedidas); suscripción para creadores recurrentes |
| Bajo costo de imitación de plantillas individuales | El foso no son las plantillas: es la plataforma (automatización, panel, estadísticas, marca) |
| Pagos fragmentados en LatAm | Abstracción multi-proveedor: MercadoPago + Yape/Plin + Stripe (ver doc 02) |
| Contenido sensible subido por usuarios | Moderación reactiva + ToS + reporte de abuso desde el día 1 |

---

## 3. Propuesta de valor

### 3.1 Declaración

> **UWU convierte tus sentimientos en una experiencia web inolvidable, en menos de 5 minutos, sin saber nada de tecnología.**

### 3.2 Pilares (en orden de prioridad de producto)

1. **Instantáneo y automático** — pagas y tu página existe, con enlace y QR, en segundos. Sin WhatsApp, sin esperas, sin humanos en el medio. *(Ningún competidor tipo A puede igualar esto sin reconstruirse.)*
2. **Preview en tiempo real** — ves exactamente lo que recibirá tu persona mientras editas, en un marco de teléfono. Elimina la ansiedad de "¿cómo quedará?" que hoy frena la compra.
3. **Calidad de diseño premium** — plantillas que parecen hechas por un estudio de diseño, no por un generador. La marca UWU (osito, rosa, corazones) es cálida donde la competencia es genérica.
4. **Cada plantilla es una experiencia distinta** — no variaciones de color: mecánicas diferentes (carta que se abre, constelación de fotos, línea de tiempo, "Netflix de nuestra historia", mapa del primer beso…).
5. **Tuyo para siempre, y medible** — panel para editar después de publicar, renovar, descargar el QR y ver si la vio, cuántas veces y cuánto tiempo.

### 3.3 Anti-propuesta (lo que UWU NO es)

- No es un site builder genérico (no competimos con Wix).
- No es una app de citas ni red social.
- No vende código: vende **experiencias publicadas**.

---

## 4. Modelo de negocio

### 4.1 Flujo de ingreso principal: pago por dedicatoria

```
Elegir plantilla → Personalizar → Preview → Pagar → Página generada → Enlace + QR → Compartir
```

Precios de lanzamiento (ajustables por país vía multimoneda futura; lanzamiento en USD + moneda local del país inicial):

| Plan | Precio | Incluye |
|---|---|---|
| **Gratis** | $0 | 2–3 plantillas free, marca de agua UWU, 1 foto, sin música subida (solo biblioteca), enlace válido 7 días |
| **Chispa** (por dedicatoria) | ~US$ 3.99 | 1 plantilla premium, multimedia completa, enlace 1 año, QR, sin marca de agua |
| **Llama** (por dedicatoria) | ~US$ 6.99 | Todo Chispa + contraseña, countdown, contador de relación, música subida, estadísticas avanzadas, enlace de por vida |
| **UWU Infinito** (suscripción) | ~US$ 7.99/mes | Dedicatorias premium ilimitadas (uso justo), todas las plantillas, estadísticas, prioridad en soporte |

Reglas del modelo:
- El plan gratis existe para **alimentar la viralidad** (marca de agua = anuncio) y el remarketing (upgrade para quitar la marca y desbloquear música).
- La expiración de enlaces gratis crea urgencia de upgrade y controla costos de storage.
- "Enlace de por vida" se respalda con costo marginal ínfimo (página estática + media en R2).

### 4.2 Fuentes de ingreso secundarias (activación por fases, ver roadmap)

| Fuente | Fase | Mecánica |
|---|---|---|
| Plantillas premium individuales destacadas | MVP | Algunas plantillas "edición especial" con precio propio |
| Música premium | v1.1 | Biblioteca licenciada + efectos de entrada exclusivos |
| Dominio personalizado | v1.2 | `tunombre.uwu.app` (subdominio) y luego dominio propio del cliente, cargo anual |
| Cupones y promociones | MVP | Motor de descuentos (porcentual, fijo, por campaña, por primera compra) |
| Programa de referidos | v1.1 | Cliente refiere → ambos reciben crédito/descuento |
| Programa de afiliados | v1.2 | Influencers de TikTok con link/código, comisión % sobre ventas, panel propio |
| Marketplace de plantillas | v2 | Diseñadores externos publican plantillas, revenue share 70/30; convierte a UWU en plataforma de dos lados |

### 4.3 Unit economics (estimación de diseño, a validar con datos reales)

- Costo variable por dedicatoria: fracciones de centavo (ISR + R2 sin egreso + Postgres). El costo real es la **comisión de pago** (~3.5–5% + fijo en LatAm) — razón por la que el precio mínimo pagado no debe bajar de ~US$2.5.
- Costos fijos iniciales: Vercel Pro (~$20/mes) + Railway Pro (~$20/mes base + uso) + R2 (~$0 al inicio) ≈ **<$60/mes**. Punto de equilibrio: ~15–20 dedicatorias/mes. El modelo es rentable casi desde la primera venta.
- Métricas norte: **conversión visita→pago**, **% de dedicatorias compartidas** (coeficiente viral), **compras repetidas por usuario/año**.

### 4.4 Por qué este modelo gana

El tipo A no puede automatizarse sin dejar de ser lo que es; el tipo B no tiene la calidad ni la profundidad de producto. UWU cobra lo mismo o apenas más, entrega 10× más valor percibido, y cada página publicada lleva el logo del osito frente a decenas de espectadores emocionalmente receptivos. **El producto es el canal de adquisición.**
