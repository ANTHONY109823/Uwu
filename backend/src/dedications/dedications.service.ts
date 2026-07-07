import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeneratorService } from '../generator/generator.service';
import { generateAccessCode, generateSlug } from '../common/utils';

export interface DraftDto {
  templateSlug: string;
  para?: string;
  de?: string;
  mensaje?: string;
  cancion?: string;
  currency?: string;
}

@Injectable()
export class DedicationsService {
  constructor(
    private prisma: PrismaService,
    private generator: GeneratorService,
  ) {}

  async createDraft(dto: DraftDto) {
    const template = await this.prisma.template.findUnique({
      where: { slug: dto.templateSlug },
      include: { level: true },
    });
    if (!template || !template.isActive) {
      throw new NotFoundException('Plantilla no encontrada');
    }

    const pen = Number(template.pricePen ?? template.level.pricePen);
    const usd = Number(template.priceUsd ?? template.level.priceUsd);
    const currency = dto.currency ?? 'PEN';
    const amount = currency === 'USD' ? usd : pen;

    const order = await this.prisma.order.create({
      data: {
        templateId: template.id,
        status: 'draft',
        currency,
        amount,
        draftData: {
          para: dto.para ?? '',
          de: dto.de ?? '',
          mensaje: dto.mensaje ?? '',
          cancion: dto.cancion ?? 'Ed Sheeran — Perfect',
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      orderId: order.id,
      status: order.status,
      previewUrl: `/api/dedications/preview/${order.id}`,
      isFree: template.level.code === 'free',
      amount: Number(order.amount),
      currency: order.currency,
    };
  }

  async updateDraft(orderId: string, dto: Partial<DraftDto>) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.status !== 'draft') {
      throw new BadRequestException('La orden ya no es editable');
    }

    const draft = (order.draftData as Record<string, string>) ?? {};
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        draftData: {
          ...draft,
          ...(dto.para !== undefined && { para: dto.para }),
          ...(dto.de !== undefined && { de: dto.de }),
          ...(dto.mensaje !== undefined && { mensaje: dto.mensaje }),
          ...(dto.cancion !== undefined && { cancion: dto.cancion }),
        },
      },
    });
    return { orderId: updated.id, status: updated.status };
  }

  async getPreviewHtml(orderId: string): Promise<string> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { template: { include: { level: true } } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    const draft = order.draftData as Record<string, string>;
    const accessCode = 'UWU-PREVIEW';
    return this.generator.buildFromSlug(order.template.slug, {
      para: draft.para || 'Mariana',
      de: draft.de || 'Diego',
      mensaje: draft.mensaje || 'Desde el día en que llegaste, mi mundo tiene más color. Te amo, hoy y siempre.',
      cancion: draft.cancion || 'Ed Sheeran — Perfect',
      accessCode,
      templateName: order.template.name,
      templateEmoji: order.template.emoji,
      templateCode: order.template.code,
      gradient: order.template.previewGradient ?? 'linear-gradient(135deg,#EE7EB1,#E8447A)',
      tier: order.template.level.code,
    });
  }

  async generateFromOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { template: { include: { level: true } }, dedication: true },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.dedication) return this.mapDedication(order.dedication, order.template.slug);

    const draft = order.draftData as Record<string, string>;
    const accessCode = generateAccessCode();
    let slug = generateSlug();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await this.prisma.dedication.findUnique({ where: { slug } });
      if (!exists) break;
      slug = generateSlug();
      attempts++;
    }

    const html = await this.generator.buildFromSlug(order.template.slug, {
      para: draft.para || 'Mariana',
      de: draft.de || 'Diego',
      mensaje: draft.mensaje || 'Te amo, hoy y siempre.',
      cancion: draft.cancion || 'Ed Sheeran — Perfect',
      accessCode,
      templateName: order.template.name,
      templateEmoji: order.template.emoji,
      templateCode: order.template.code,
      gradient: order.template.previewGradient ?? 'linear-gradient(135deg,#EE7EB1,#E8447A)',
      tier: order.template.level.code,
    });

    const dedication = await this.prisma.dedication.create({
      data: {
        orderId: order.id,
        templateId: order.templateId,
        slug,
        accessCode,
        para: draft.para || 'Mariana',
        de: draft.de || 'Diego',
        mensaje: draft.mensaje || 'Te amo, hoy y siempre.',
        cancion: draft.cancion,
        htmlContent: html,
        editUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await this.prisma.template.update({
      where: { id: order.templateId },
      data: { purchaseCount: { increment: 1 } },
    });

    return this.mapDedication(dedication, order.template.slug);
  }

  async getBySlug(slug: string) {
    const dedication = await this.prisma.dedication.findUnique({
      where: { slug },
      include: { template: true },
    });
    if (!dedication || !dedication.isActive) {
      throw new NotFoundException('Dedicatoria no encontrada');
    }

    await this.prisma.dedication.update({
      where: { id: dedication.id },
      data: { visitCount: { increment: 1 } },
    });

    return {
      slug: dedication.slug,
      para: dedication.para,
      de: dedication.de,
      mensaje: dedication.mensaje,
      cancion: dedication.cancion,
      accessCode: dedication.accessCode,
      htmlContent: dedication.htmlContent,
      template: {
        slug: dedication.template.slug,
        name: dedication.template.name,
        emoji: dedication.template.emoji,
        code: dedication.template.code,
        gradient: dedication.template.previewGradient,
      },
      createdAt: dedication.createdAt,
    };
  }

  async getByCode(code: string) {
    const dedication = await this.prisma.dedication.findUnique({
      where: { accessCode: code },
      include: { template: true },
    });
    if (!dedication) throw new NotFoundException('Código no válido');
    return this.getBySlug(dedication.slug);
  }

  private mapDedication(
    d: { slug: string; accessCode: string; para: string; de: string; mensaje: string; cancion: string | null },
    templateSlug: string,
  ) {
    return {
      slug: d.slug,
      accessCode: d.accessCode,
      para: d.para,
      de: d.de,
      mensaje: d.mensaje,
      cancion: d.cancion,
      viewUrl: `/d/${d.slug}`,
      templateSlug,
    };
  }
}
