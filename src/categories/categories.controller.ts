import {
  UsePipes,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.schema';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get('/all')
  getAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, data);
  }
}
