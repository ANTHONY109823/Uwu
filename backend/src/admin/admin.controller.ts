import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { apiSuccess } from '../common/utils';

@Controller('api/admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return apiSuccess(await this.admin.login(body.email, body.password));
  }

  @Get('dashboard')
  async dashboard() {
    return apiSuccess(await this.admin.getDashboard());
  }

  @Get('orders')
  async orders() {
    return apiSuccess(await this.admin.getOrders());
  }

  @Get('dedications')
  async dedications() {
    return apiSuccess(await this.admin.getDedications());
  }
}
