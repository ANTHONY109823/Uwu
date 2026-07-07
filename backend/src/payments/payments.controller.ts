import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { apiSuccess } from '../common/utils';

@Controller('api/payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('create')
  async create(@Body() body: { orderId: string }) {
    return apiSuccess(await this.payments.createPayment(body.orderId));
  }

  @Post('free')
  async free(@Body() body: { orderId: string }) {
    return apiSuccess(await this.payments.processFree(body.orderId));
  }

  @Get('status/:orderId')
  async status(@Param('orderId') orderId: string) {
    return apiSuccess(await this.payments.getStatus(orderId));
  }

  @Post('webhook')
  async webhook(@Body() body: Record<string, unknown>) {
    return apiSuccess(await this.payments.handleWebhook(body));
  }
}
