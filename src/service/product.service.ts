import { ProductModel } from '../models/products.model';
import { StoreModel } from '../models/store.model';
import { CreateProductDto } from '../dtos/productDto/createProduct.dto';
import { UpdateProductDto } from '../dtos/productDto/updateProduct.dto';
import { AppError } from '../utils/appError';

export class ProductService {
  public static async createProduct(
    productData: CreateProductDto,
    storeId: string,
    userId: string,
  ) {
    const store = await StoreModel.findOne({
      _id: storeId,
      owner: userId,
      isDeleted: { $ne: true },
    });

    if (!store) {
      throw new AppError(
        'Store not found or you are not authorized to add products to it',
        403,
      );
    }

    const newProduct = await ProductModel.create({
      ...productData,
      storeId,
      userId,
    });

    return newProduct;
  }

  public static async getAllProducts(userId: string) {
    const stores = await StoreModel.find({
      owner: userId,
      isDeleted: { $ne: true },
    }).select('_id');

    const storeIds = stores.map((store) => store._id);

    const products = await ProductModel.find({
      storeId: { $in: storeIds },
      isDeleted: { $ne: true },
    });

    return products;
  }

  public static async updateProduct(
    productId: string,
    updateData: UpdateProductDto,
    userId: string,
  ) {
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    //if the product belongs to a store owned by the user
    const store = await StoreModel.findOne({
      _id: product.storeId,
      owner: userId,
      isDeleted: { $ne: true },
    });

    if (!store) {
      throw new AppError('You are not authorized to update this product', 403);
    }

    Object.assign(product, updateData);
    await product.save();

    return product;
  }

  public static async deleteProduct(productId: string, userId: string) {
    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    //product belongs to a store owned by the user
    const store = await StoreModel.findOne({
      _id: product.storeId,
      owner: userId,
      isDeleted: { $ne: true },
    });

    if (!store) {
      throw new AppError('You are not authorized to delete this product', 403);
    }

    product.isDeleted = true;
    await product.save();

    return { message: 'Product deleted successfully' };
  }
}
