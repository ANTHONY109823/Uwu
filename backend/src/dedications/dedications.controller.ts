import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Header,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { DedicationsService } from './dedications.service';
import type { DraftDto } from './dedications.service';
import { apiSuccess } from '../common/utils';

@Controller('api/dedications')
export class DedicationsController {
  constructor(private dedications: DedicationsService) {}

  @Post('draft')
  async createDraft(@Body() body: DraftDto) {
    return apiSuccess(await this.dedications.createDraft(body));
  }

  @Put(':id')
  async updateDraft(@Param('id') id: string, @Body() body: Partial<DraftDto>) {
    return apiSuccess(await this.dedications.updateDraft(id, body));
  }

  @Get('preview/:id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  async preview(@Param('id') id: string, @Res() res: Response) {
    const html = await this.dedications.getPreviewHtml(id);
    res.send(html);
  }

  @Get('by-code/:code')
  async byCode(@Param('code') code: string) {
    return apiSuccess(await this.dedications.getByCode(code));
  }
}

@Controller('api')
export class DedicationPublicController {
  constructor(private dedications: DedicationsService) {}

  @Get('dedications/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return apiSuccess(await this.dedications.getBySlug(slug));
  }
}
