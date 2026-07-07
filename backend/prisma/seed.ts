import { PrismaClient, TierLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CATEGORIES, LEVELS, TEMPLATES, DEFAULT_FIELDS } from './seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding UWU database...');

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  for (const lvl of LEVELS) {
    await prisma.level.upsert({
      where: { code: lvl.code as TierLevel },
      update: {
        name: lvl.name,
        emoji: lvl.emoji,
        pricePen: lvl.pricePen,
        priceUsd: lvl.priceUsd,
      },
      create: {
        code: lvl.code as TierLevel,
        name: lvl.name,
        emoji: lvl.emoji,
        pricePen: lvl.pricePen,
        priceUsd: lvl.priceUsd,
        features: [],
      },
    });
  }

  const categories = await prisma.category.findMany();
  const levels = await prisma.level.findMany();
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const lvlMap = Object.fromEntries(levels.map((l) => [l.code, l.id]));

  for (const t of TEMPLATES) {
    const template = await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        emoji: t.emoji,
        description: t.desc,
        categoryId: catMap[t.categorySlug],
        levelId: lvlMap[t.tier as TierLevel],
        pricePen: t.pen,
        priceUsd: t.usd,
        previewGradient: t.grad,
        pillText: t.pill,
        titleText: t.title,
        htmlPath: `templates/${t.slug}/index.html`,
        isFeatured: t.featured,
        sortOrder: t.sort,
      },
      create: {
        slug: t.slug,
        code: t.code,
        name: t.name,
        emoji: t.emoji,
        description: t.desc,
        categoryId: catMap[t.categorySlug],
        levelId: lvlMap[t.tier as TierLevel],
        pricePen: t.pen,
        priceUsd: t.usd,
        previewGradient: t.grad,
        pillText: t.pill,
        titleText: t.title,
        htmlPath: `templates/${t.slug}/index.html`,
        isFeatured: t.featured,
        sortOrder: t.sort,
      },
    });

    for (const f of DEFAULT_FIELDS) {
      await prisma.templateField.upsert({
        where: { templateId_fieldKey: { templateId: template.id, fieldKey: f.fieldKey } },
        update: f,
        create: { templateId: template.id, ...f },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@uwu.app';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'uwu-admin-2026';
  const hash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hash,
      name: 'Admin UWU',
      role: 'superadmin',
    },
  });

  console.log(`✅ Seed complete — ${TEMPLATES.length} templates, admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
