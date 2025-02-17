import { Router } from 'express';
import { productController } from '../controller/products.controller';
import { JwtAuthGuard, RoleGuard } from '../middleware/auth.middleware';
import { UserRole } from '../types/user.types';

export const productRouter = Router();

productRouter
  .route('/')
  .post(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    productController.createProduct,
  );
productRouter.route('/').get(JwtAuthGuard, productController.getAllProducts);
productRouter
  .route('/:id')
  .patch(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    productController.updateProduct,
  );

productRouter
  .route('/:id')
  .delete(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    productController.deleteProduct,
  );
