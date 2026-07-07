import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { formatPrice } from '../common/utils';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { templates: { where: { isActive: true } } } } },
    });
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      templateCount: c._count.templates,
    }));
  }

  async getCategoryBySlug(slug: string, currency = 'PEN') {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        templates: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: { level: true, category: true },
        },
      },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return {
      ...category,
      templates: category.templates.map((t) => this.mapTemplate(t, currency)),
    };
  }

  async getTemplates(filters: {
    category?: string;
    level?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    currency?: string;
  }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 50;
    const where: Record<string, unknown> = { isActive: true };

    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.level) {
      where.level = { code: filters.level };
    }
    if (filters.featured) {
      where.isFeatured = true;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [templates, total] = await Promise.all([
      this.prisma.template.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { level: true, category: true },
      }),
      this.prisma.template.count({ where }),
    ]);

    return {
      items: templates.map((t) => this.mapTemplate(t, filters.currency ?? 'PEN')),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getTemplateBySlug(slug: string, currency = 'PEN') {
    const template = await this.prisma.template.findUnique({
      where: { slug },
      include: { level: true, category: true, fields: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!template || !template.isActive) throw new NotFoundException('Plantilla no encontrada');
    return this.mapTemplateDetail(template, currency);
  }

  private mapTemplate(t: {
    slug: string;
    code: string;
    name: string;
    emoji: string;
    description: string | null;
    previewGradient: string | null;
    pillText: string | null;
    titleText: string | null;
    pricePen: { toNumber?: () => number } | number | null;
    priceUsd: { toNumber?: () => number } | number | null;
    isFeatured: boolean;
    level: { code: string; name: string; emoji: string; pricePen: unknown; priceUsd: unknown };
    category: { slug: string; name: string; emoji: string };
  }, currency: string) {
    const pen = Number(t.pricePen ?? t.level.pricePen);
    const usd = Number(t.priceUsd ?? t.level.priceUsd);
    return {
      slug: t.slug,
      code: t.code,
      name: t.name,
      emoji: t.emoji,
      description: t.description,
      category: t.category.slug,
      categoryName: t.category.name,
      level: t.level.code,
      levelName: t.level.name,
      levelEmoji: t.level.emoji,
      price: {
        pen: pen.toFixed(2),
        usd: usd.toFixed(2),
        formatted: formatPrice(pen, usd, t.level.code, currency),
      },
      previewGradient: t.previewGradient,
      pill: t.pillText,
      title: t.titleText,
      isFeatured: t.isFeatured,
    };
  }

  private mapTemplateDetail(t: {
    slug: string;
    code: string;
    name: string;
    emoji: string;
    description: string | null;
    previewGradient: string | null;
    pillText: string | null;
    titleText: string | null;
    pricePen: unknown;
    priceUsd: unknown;
    isFeatured: boolean;
    level: { code: string; name: string; emoji: string; pricePen: unknown; priceUsd: unknown };
    category: { slug: string; name: string; emoji: string };
    fields: Array<{
      fieldKey: string;
      fieldType: string;
      label: string;
      placeholder: string | null;
      maxLength: number | null;
      isRequired: boolean;
    }>;
  }, currency: string) {
    return {
      ...this.mapTemplate(t as Parameters<typeof this.mapTemplate>[0], currency),
      fields: t.fields,
    };
  }
}
