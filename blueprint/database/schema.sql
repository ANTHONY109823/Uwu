# 🗄️ Esquema de Base de Datos — UWU

> PostgreSQL 16 · Ver también [diagramas/erd.md](../diagramas/erd.md)

```sql
-- ============================================================
-- UWU Database Schema v0.1.0
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ──────────────────────────────────────────────────

CREATE TYPE tier_level AS ENUM ('free', 'premium', 'exclusive');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'paid', 'free', 'failed', 'expired', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded');
CREATE TYPE admin_role AS ENUM ('superadmin', 'editor', 'support', 'analyst');
CREATE TYPE music_source AS ENUM ('text', 'youtube', 'spotify', 'upload');

-- ── CATEGORIES ─────────────────────────────────────────────

CREATE TABLE categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  emoji       VARCHAR(10)  NOT NULL DEFAULT '❤️',
  description TEXT,
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active, sort_order);

-- ── LEVELS ─────────────────────────────────────────────────

CREATE TABLE levels (
  id          SERIAL PRIMARY KEY,
  code        tier_level   NOT NULL UNIQUE,
  name        VARCHAR(50)  NOT NULL,
  emoji       VARCHAR(10)  NOT NULL,
  price_pen   DECIMAL(8,2) NOT NULL DEFAULT 0,
  price_usd   DECIMAL(8,2) NOT NULL DEFAULT 0,
  features    JSONB        NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── TEMPLATES ──────────────────────────────────────────────

CREATE TABLE templates (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(80)  NOT NULL UNIQUE,
  code            VARCHAR(12)  NOT NULL UNIQUE,  -- UWU-XXXX
  name            VARCHAR(120) NOT NULL,
  emoji           VARCHAR(10)  NOT NULL,
  description     TEXT,
  category_id     INT          NOT NULL REFERENCES categories(id),
  level_id        INT          NOT NULL REFERENCES levels(id),
  price_pen       DECIMAL(8,2),  -- override opcional del level
  price_usd       DECIMAL(8,2),
  preview_gradient VARCHAR(200),
  pill_text       VARCHAR(80),   -- "Tocar para abrir 🎀"
  title_text      VARCHAR(120),
  html_path       VARCHAR(200),  -- templates/hello-kitty/index.html
  config_json     JSONB        NOT NULL DEFAULT '{}',
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  is_featured     BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order      INT          NOT NULL DEFAULT 0,
  visit_count     INT          NOT NULL DEFAULT 0,
  purchase_count  INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_slug ON templates(slug);
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_level ON templates(level_id);
CREATE INDEX idx_templates_active ON templates(is_active, sort_order);
CREATE INDEX idx_templates_featured ON templates(is_featured) WHERE is_featured = TRUE;

-- ── TEMPLATE FIELDS ────────────────────────────────────────

CREATE TABLE template_fields (
  id           SERIAL PRIMARY KEY,
  template_id  INT          NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  field_key    VARCHAR(50)  NOT NULL,
  field_type   VARCHAR(20)  NOT NULL,  -- text, textarea, image, music
  label        VARCHAR(100) NOT NULL,
  placeholder  VARCHAR(200),
  max_length   INT,
  is_required  BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order   INT          NOT NULL DEFAULT 0,
  UNIQUE(template_id, field_key)
);

-- ── USERS (temporales / anónimos) ──────────────────────────

CREATE TABLE users_temp (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255),
  ip_hash     VARCHAR(64),   -- SHA256 del IP (privacidad)
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_seen   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_temp_email ON users_temp(email) WHERE email IS NOT NULL;

-- ── ORDERS ─────────────────────────────────────────────────

CREATE TABLE orders (
  id            UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID           REFERENCES users_temp(id),
  template_id   INT            NOT NULL REFERENCES templates(id),
  status        order_status   NOT NULL DEFAULT 'draft',
  currency      VARCHAR(3)     NOT NULL DEFAULT 'PEN',
  amount        DECIMAL(8,2)   NOT NULL DEFAULT 0,
  draft_data    JSONB          NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_template ON orders(template_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ── PAYMENTS ───────────────────────────────────────────────

CREATE TABLE payments (
  id                UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID            NOT NULL REFERENCES orders(id),
  mercadopago_id    VARCHAR(100),
  preference_id     VARCHAR(100),
  status            payment_status  NOT NULL DEFAULT 'pending',
  currency          VARCHAR(3)      NOT NULL DEFAULT 'PEN',
  amount            DECIMAL(8,2)    NOT NULL,
  payment_method    VARCHAR(50),
  mp_raw_response   JSONB,
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_payments_mp_id ON payments(mercadopago_id) WHERE mercadopago_id IS NOT NULL;
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ── WEBHOOK EVENTS (idempotencia) ──────────────────────────

CREATE TABLE webhook_events (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id   VARCHAR(100) NOT NULL UNIQUE,
  source            VARCHAR(20)  NOT NULL DEFAULT 'mercadopago',
  payload           JSONB        NOT NULL,
  processed         BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── DEDICATIONS ────────────────────────────────────────────

CREATE TABLE dedications (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID         REFERENCES orders(id),
  template_id     INT          NOT NULL REFERENCES templates(id),
  slug            VARCHAR(100) NOT NULL UNIQUE,
  access_code     VARCHAR(20)  NOT NULL UNIQUE,
  para            VARCHAR(50)  NOT NULL,
  de              VARCHAR(50)  NOT NULL,
  mensaje         TEXT         NOT NULL,
  cancion         VARCHAR(200),
  music_source    music_source DEFAULT 'text',
  music_url       VARCHAR(500),
  html_url        VARCHAR(500),
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  expires_at      TIMESTAMPTZ,  -- NULL = sin expiración
  edit_until      TIMESTAMPTZ,  -- ventana de edición gratuita
  visit_count     INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_dedications_slug ON dedications(slug);
CREATE UNIQUE INDEX idx_dedications_access_code ON dedications(access_code);
CREATE INDEX idx_dedications_template ON dedications(template_id);
CREATE INDEX idx_dedications_active ON dedications(is_active);

-- ── DEDICATION IMAGES ──────────────────────────────────────

CREATE TABLE dedication_images (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  dedication_id   UUID         NOT NULL REFERENCES dedications(id) ON DELETE CASCADE,
  url             VARCHAR(500) NOT NULL,
  storage_key     VARCHAR(200) NOT NULL,
  mime_type       VARCHAR(50)  NOT NULL,
  size_bytes      INT          NOT NULL,
  sort_order      INT          NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dedication_images_dedication ON dedication_images(dedication_id);

-- ── DEDICATION MUSIC ───────────────────────────────────────

CREATE TABLE dedication_music (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  dedication_id   UUID         NOT NULL REFERENCES dedications(id) ON DELETE CASCADE,
  source          music_source NOT NULL,
  title           VARCHAR(200),
  url             VARCHAR(500),
  file_key        VARCHAR(200),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── VISITS ─────────────────────────────────────────────────

CREATE TABLE visits (
  id              BIGSERIAL    PRIMARY KEY,
  dedication_id   UUID         NOT NULL REFERENCES dedications(id),
  ip_hash         VARCHAR(64),
  user_agent      VARCHAR(300),
  referrer        VARCHAR(500),
  country         VARCHAR(2),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visits_dedication ON visits(dedication_id);
CREATE INDEX idx_visits_created ON visits(created_at DESC);

-- ── ADMIN USERS ────────────────────────────────────────────

CREATE TABLE admin_users (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100) NOT NULL,
  role            admin_role   NOT NULL DEFAULT 'editor',
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── AUDIT LOGS ─────────────────────────────────────────────

CREATE TABLE audit_logs (
  id              BIGSERIAL    PRIMARY KEY,
  admin_id        UUID         REFERENCES admin_users(id),
  action          VARCHAR(100) NOT NULL,
  entity_type     VARCHAR(50),
  entity_id       VARCHAR(100),
  details         JSONB,
  ip_hash         VARCHAR(64),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ── SETTINGS ───────────────────────────────────────────────

CREATE TABLE settings (
  key             VARCHAR(100) PRIMARY KEY,
  value           JSONB        NOT NULL,
  description     TEXT,
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── SEED DATA ──────────────────────────────────────────────

INSERT INTO levels (code, name, emoji, price_pen, price_usd, features) VALUES
  ('free',      'Gratis',    '🆓', 0.00, 0.00,    '["uwu_brand","basic_animations","1_photo","share"]'),
  ('premium',   'Premium',   '💌', 5.00, 1.49,    '["subtle_brand","5_photos","youtube_music","animations"]'),
  ('exclusive', 'Exclusiva', '💎', 8.00, 2.49,    '["no_brand","10_photos","spotify_youtube","advanced_animations","priority"]');

INSERT INTO categories (slug, name, emoji, sort_order) VALUES
  ('amor',             'Amor',              '❤️',  1),
  ('romantica',        'Romántica',         '💌',  2),
  ('cumpleanos',       'Cumpleaños',        '🎂',  3),
  ('aniversario',      'Aniversario',       '💕',  4),
  ('perdon',           'Perdón',            '🌸',  5),
  ('extranar',         'Extrañar',          '💔',  6),
  ('familia',          'Familia',           '👨‍👩‍👧', 7),
  ('mascotas',         'Mascotas',          '🐶',  8),
  ('sorprender',       'Sorprender',        '✨',  9),
  ('fechas-especiales','Fechas especiales', '🎄', 10),
  ('cerrar-ciclos',    'Cerrar ciclos',     '🕊️', 11),
  ('pedida',           'Pedida de mano',    '💍', 12);
```
