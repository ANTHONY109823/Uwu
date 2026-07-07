import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Token simple para MVP — reemplazar con JWT en producción
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    return {
      accessToken: token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersToday, ordersWeek, visitsToday, topTemplates, totalDedications] =
      await Promise.all([
        this.prisma.order.count({
          where: { status: { in: ['paid', 'free'] }, createdAt: { gte: today } },
        }),
        this.prisma.order.count({
          where: {
            status: { in: ['paid', 'free'] },
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        }),
        this.prisma.visit.count({ where: { createdAt: { gte: today } } }),
        this.prisma.template.findMany({
          orderBy: { purchaseCount: 'desc' },
          take: 5,
          select: { slug: true, name: true, purchaseCount: true, emoji: true },
        }),
        this.prisma.dedication.count({ where: { isActive: true } }),
      ]);

    const salesToday = await this.prisma.order.aggregate({
      where: { status: 'paid', createdAt: { gte: today } },
      _sum: { amount: true },
    });

    return {
      salesToday: { count: ordersToday, amount: Number(salesToday._sum.amount ?? 0) },
      salesWeek: { count: ordersWeek },
      visitsToday,
      totalDedications,
      topTemplates,
    };
  }

  async getOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { template: true, payment: true, dedication: true },
    });
  }

  async getDedications() {
    return this.prisma.dedication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { template: true },
    });
  }
}
