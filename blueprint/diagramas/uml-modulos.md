# 🧩 Diagramas UML — Módulos UWU

## Diagrama de clases — Módulo Catálogo

```mermaid
classDiagram
    class Category {
        +int id
        +string slug
        +string name
        +string emoji
        +int sortOrder
        +boolean isActive
        +getTemplates() Template[]
    }

    class Level {
        +int id
        +TierLevel code
        +string name
        +decimal pricePen
        +decimal priceUsd
        +string[] features
    }

    class Template {
        +int id
        +string slug
        +string code
        +string name
        +string emoji
        +int categoryId
        +int levelId
        +decimal pricePen
        +decimal priceUsd
        +boolean isActive
        +getFields() TemplateField[]
        +getPrice(currency) string
    }

    class TemplateField {
        +int id
        +string fieldKey
        +FieldType fieldType
        +string label
        +int maxLength
        +boolean isRequired
    }

    Category "1" --> "*" Template
    Level "1" --> "*" Template
    Template "1" --> "*" TemplateField
```

---

## Diagrama de clases — Módulo Dedicatorias

```mermaid
classDiagram
    class Order {
        +uuid id
        +uuid userId
        +int templateId
        +OrderStatus status
        +string currency
        +decimal amount
        +json draftData
        +create() Order
        +update(data) void
        +expire() void
    }

    class Dedication {
        +uuid id
        +uuid orderId
        +string slug
        +string accessCode
        +string para
        +string de
        +string mensaje
        +boolean isActive
        +generate(order) Dedication
        +update(data) void
        +deactivate() void
    }

    class DedicationImage {
        +uuid id
        +string url
        +string storageKey
        +int sortOrder
    }

    class DedicationMusic {
        +uuid id
        +MusicSource source
        +string title
        +string url
    }

    Order "1" --> "0..1" Dedication
    Dedication "1" --> "*" DedicationImage
    Dedication "1" --> "0..1" DedicationMusic
```

---

## Diagrama de clases — Módulo Pagos

```mermaid
classDiagram
    class PaymentService {
        +createPreference(orderId) Preference
        +handleWebhook(payload) void
        +getStatus(orderId) PaymentStatus
        +processFree(orderId) Dedication
    }

    class Payment {
        +uuid id
        +uuid orderId
        +string mercadopagoId
        +PaymentStatus status
        +decimal amount
        +approve() void
        +reject() void
        +refund() void
    }

    class WebhookEvent {
        +uuid id
        +string notificationId
        +json payload
        +boolean processed
        +isDuplicate(id) boolean
    }

    class MercadoPagoClient {
        +createPreference(data) Preference
        +getPayment(id) Payment
        +validateSignature(sig) boolean
    }

    PaymentService --> MercadoPagoClient
    PaymentService --> Payment
    PaymentService --> WebhookEvent
```

---

## Diagrama de clases — Generador HTML

```mermaid
classDiagram
    class GeneratorService {
        +generate(order) Dedication
        +regenerate(dedicationId) void
        +buildPreview(draftData) string
    }

    class TemplateLoader {
        +load(slug) TemplateHTML
        +getPlaceholders() string[]
    }

    class PlaceholderEngine {
        +replace(html, data) string
        +injectImages(html, images) string
        +injectMusic(html, music) string
        +injectBrand(html, tier) string
    }

    class SlugGenerator {
        +generate() string
        +isUnique(slug) boolean
    }

    class AccessCodeGenerator {
        +generate() string
        +format UWU-XXXX-XXXX
    }

    GeneratorService --> TemplateLoader
    GeneratorService --> PlaceholderEngine
    GeneratorService --> SlugGenerator
    GeneratorService --> AccessCodeGenerator
```

---

## Diagrama de secuencia — Crear dedicatoria

```mermaid
sequenceDiagram
    participant C as Client
    participant DS as DedicationService
    participant GS as GeneratorService
    participant TL as TemplateLoader
    participant PE as PlaceholderEngine
    participant DB as Database

    C->>DS: createFromOrder(orderId)
    DS->>DB: getOrder(orderId)
    DS->>GS: generate(order)
    GS->>TL: load(templateSlug)
    TL-->>GS: htmlTemplate
    GS->>PE: replace(html, draftData)
    PE-->>GS: finalHTML
    GS->>DB: saveDedication(slug, code, html)
    GS-->>DS: dedication
    DS-->>C: { slug, url, accessCode }
```

---

## Diagrama de componentes — Editor

```mermaid
graph TB
    subgraph Editor Page
        EF[EditorForm]
        PU[PhotoUploader]
        MP[MusicPicker]
        PF[PreviewFrame]
        SB[SaveBar]
    end

    subgraph Hooks
        UD[useDraft]
        UP[usePreview]
        UU[useUpload]
    end

    subgraph API
        API_DRAFT[POST /dedications/draft]
        API_UPLOAD[POST /upload]
        API_PREVIEW[GET /preview]
    end

    EF --> UD
    PU --> UU
    MP --> UD
    PF --> UP
    SB --> UD

    UD --> API_DRAFT
    UU --> API_UPLOAD
    UP --> API_PREVIEW
```
