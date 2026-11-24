import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

type AuthUser = { userId: number };

@UseGuards(JwtAuthGuard) // every route in this controller needs a valid token
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.categoriesService.findOne(id, user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CategoryDto) {
    return this.categoriesService.create(user.userId, dto);
  }

  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: CategoryDto) {
    return this.categoriesService.replace(id, user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.categoriesService.remove(id, user.userId);
  }
}
