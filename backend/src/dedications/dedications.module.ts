import { Module } from '@nestjs/common';
import { DedicationsController, DedicationPublicController } from './dedications.controller';
import { DedicationsService } from './dedications.service';
import { GeneratorModule } from '../generator/generator.module';

@Module({
  imports: [GeneratorModule],
  controllers: [DedicationsController, DedicationPublicController],
  providers: [DedicationsService],
  exports: [DedicationsService],
})
export class DedicationsModule {}
