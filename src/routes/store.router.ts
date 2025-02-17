import { Router } from 'express';
import { storeController } from '../controller/store.controller';
import { JwtAuthGuard, RoleGuard } from '../middleware/auth.middleware';
import { UserRole } from '../types/user.types';

export const storeRouter = Router();

storeRouter
  .route('/')
  .post(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    storeController.createStore,
  );
storeRouter.route('/').get(JwtAuthGuard, storeController.getAllStore);
storeRouter
  .route('/:id')
  .patch(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    storeController.updateStore,
  );

storeRouter
  .route('/:id')
  .delete(
    JwtAuthGuard,
    RoleGuard([UserRole.VENDOR]),
    storeController.deleteStore,
  );
