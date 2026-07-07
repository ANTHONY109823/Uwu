import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { DedicationsModule } from './dedications/dedications.module';
import { PaymentsModule } from './payments/payments.module';
import { GeneratorModule } from './generator/generator.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    CatalogModule,
    DedicationsModule,
    PaymentsModule,
    GeneratorModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
