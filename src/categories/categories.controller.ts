import {
  UsePipes,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  ValidationPipe,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
  UpdateProductDto,
} from './category.dto';
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

  @Get('search')
  async searchCategories(@Query('keyword') keyword: string) {
    return this.categoryService.searchCategoryByName(keyword);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, data);
  }

  @Post(':categoryId/products')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addProductToCategory(
    @Param('categoryId') categoryId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    const newProduct = {
      ...createProductDto,
      _id: new Types.ObjectId(),
    };

    return this.categoryService.createProduct(categoryId, newProduct);
  }

  @Patch(':categoryId/products/:productId')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateProduct(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
    @Body() data: UpdateProductDto,
  ): Promise<Category> {
    return this.categoryService.updateProduct(categoryId, productId, data);
  }

  @Delete('delete-product/:productId')
  deleteProduct(@Param('productId') productId: string): Promise<Category> {
    return this.categoryService.deleteProduct(productId);
  }

  @Get('products/search')
  async searchProducts(@Query('keyword') keyword: string) {
    return this.categoryService.searchProductsByName(keyword);
  }
}
