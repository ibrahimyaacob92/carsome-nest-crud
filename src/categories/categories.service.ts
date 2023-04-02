import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
  UpdateProductDto,
} from './category.dto';
import { Category, CategoryDocument, Product } from './category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findById(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async create(category: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(category);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async createProduct(
    categoryId: string,
    product: CreateProductDto,
  ): Promise<Category> {
    return this.categoryModel.findOneAndUpdate(
      { _id: categoryId },
      { $push: { products: product } },
      { new: true },
    );
  }

  async updateProduct(
    categoryId: string,
    productId: string,
    data: UpdateProductDto,
  ): Promise<Category> {
    return this.categoryModel.findOneAndUpdate(
      { _id: categoryId, 'products._id': productId },
      {
        $set: {
          'products.$.price': data.price,
          'products.$.name': data.name,
          'products.$.description': data.description,
          'products.$.quantity': data.quantity,
        },
      },
      { new: true },
    );
  }

  async deleteProduct(productId: string): Promise<Category> {
    return this.categoryModel.findOneAndUpdate(
      { 'products._id': productId },
      { $pull: { products: { _id: productId } } },
      { new: true },
    );
  }

  async searchProductsByName(keyword: string): Promise<Product[]> {
    const results = await this.categoryModel.aggregate([
      { $unwind: '$products' },
      {
        $match: {
          'products.name': { $regex: keyword, $options: 'i' },
        },
      },
      {
        $project: {
          _id: '$products._id',
          name: '$products.name',
          description: '$products.description',
          price: '$products.price',
        },
      },
    ]);
    return results;
  }

  async searchCategoryByName(keyword: string): Promise<Category[]> {
    return await this.categoryModel
      .find({
        name: { $regex: keyword, $options: 'i' },
      })
      .exec();
  }
}
