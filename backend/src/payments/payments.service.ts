import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DedicationsService } from '../dedications/dedications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private dedications: DedicationsService,
  ) {}

  async createPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { template: { include: { level: true } }, payment: true },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.template.level.code === 'free') {
      throw new BadRequestException('Esta plantilla es gratis. Usa /api/payments/free');
    }

    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpToken) {
      return this.simulatePayment(orderId, order);
    }

    // Mercado Pago real — placeholder para cuando se configure el token
    const preferenceId = `sim-${Date.now()}`;
    await this.prisma.payment.upsert({
      where: { orderId },
      update: { status: 'pending', preferenceId },
      create: {
        orderId,
        preferenceId,
        status: 'pending',
        currency: order.currency,
        amount: order.amount,
      },
    });
    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'pending' } });

    return {
      preferenceId,
      initPoint: null,
      simulated: true,
      message: 'Configura MERCADOPAGO_ACCESS_TOKEN para pagos reales',
      amount: Number(order.amount),
      currency: order.currency,
    };
  }

  private async simulatePayment(
    orderId: string,
    order: { currency: string; amount: number },
  ) {
    await this.prisma.payment.upsert({
      where: { orderId },
      update: { status: 'approved' },
      create: {
        orderId,
        status: 'approved',
        currency: order.currency,
        amount: order.amount,
        mercadopagoId: `sim-${Date.now()}`,
      },
    });
    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } });
    const dedication = await this.dedications.generateFromOrder(orderId);
    return {
      simulated: true,
      approved: true,
      dedication,
      amount: Number(order.amount),
      currency: order.currency,
    };
  }

  async processFree(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { template: { include: { level: true } } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    if (order.template.level.code !== 'free') {
      throw new BadRequestException('Esta plantilla requiere pago');
    }

    await this.prisma.order.update({ where: { id: orderId }, data: { status: 'free' } });
    const dedication = await this.dedications.generateFromOrder(orderId);
    return { dedication, status: 'free' };
  }

  async getStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, dedication: true, template: { include: { level: true } } },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');

    return {
      orderId: order.id,
      status: order.status,
      paymentStatus: order.payment?.status ?? null,
      isFree: order.template.level.code === 'free',
      templateSlug: order.template.slug,
      amount: Number(order.amount),
      currency: order.currency,
      dedication: order.dedication
        ? {
            slug: order.dedication.slug,
            accessCode: order.dedication.accessCode,
            viewUrl: `/d/${order.dedication.slug}`,
          }
        : null,
    };
  }

  async handleWebhook(payload: Record<string, unknown>) {
    const notificationId = String(payload['id'] ?? payload['data'] ?? Date.now());
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { notificationId },
    });
    if (existing) return { processed: false, reason: 'duplicate' };

    await this.prisma.webhookEvent.create({
      data: { notificationId, payload: payload as object, processed: true },
    });

    // Procesar según tipo de notificación MP
    return { processed: true };
  }
}
