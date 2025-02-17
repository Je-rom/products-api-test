import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dtos/productDto/createProduct.dto';
import { UpdateProductDto } from '../dtos/productDto/updateProduct.dto';
import { validateEntity } from '../utils/validation';
import { plainToInstance } from 'class-transformer';

class ProductController {
  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData = plainToInstance(CreateProductDto, req.body);
      await validateEntity(productData);
      const { storeId } = req.body;
      const userId = req.user._id;

      const newProduct = await ProductService.createProduct(
        productData,
        storeId,
        userId,
      );

      res.status(201).json({
        status: 'success',
        message: 'Product created successfully!',
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const product = await ProductService.getAllProducts(userId);

      res.status(200).json({
        status: 'success',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updateProductData = plainToInstance(UpdateProductDto, req.body);
      await validateEntity(updateProductData);
      const { id } = req.params;
      const userId = req.user._id;

      const updatedProduct = await ProductService.updateProduct(
        id,
        updateProductData,
        userId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Product updated successfully!',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const response = await ProductService.deleteProduct(id, userId);

      res.status(200).json({
        status: 'success',
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
