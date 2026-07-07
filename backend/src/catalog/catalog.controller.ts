import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { apiSuccess } from '../common/utils';

@Controller('api')
export class CatalogController {
  constructor(private catalog: CatalogService) {}

  @Get('categories')
  async categories() {
    return apiSuccess(await this.catalog.getCategories());
  }

  @Get('categories/:slug')
  async category(@Param('slug') slug: string, @Query('currency') currency?: string) {
    return apiSuccess(await this.catalog.getCategoryBySlug(slug, currency ?? 'PEN'));
  }

  @Get('templates')
  async templates(
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('currency') currency?: string,
  ) {
    const result = await this.catalog.getTemplates({
      category,
      level,
      featured: featured === 'true',
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      currency: currency ?? 'PEN',
    });
    return apiSuccess(result.items, result.meta);
  }

  @Get('templates/:slug')
  async template(@Param('slug') slug: string, @Query('currency') currency?: string) {
    return apiSuccess(await this.catalog.getTemplateBySlug(slug, currency ?? 'PEN'));
  }
}
