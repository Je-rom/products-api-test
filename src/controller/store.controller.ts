import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validateEntity } from '../utils/validation';
import { CreateStoreDto } from '../dtos/storeDto/createStore.dto';
import { StoreService } from '../service/store.service';
import { UpdateStoreDto } from '../dtos/storeDto/updateStore.dto';
import { AppError } from '../utils/appError';

class StoreController {
  public createStore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const storeData = plainToInstance(CreateStoreDto, req.body);
      await validateEntity(storeData);

      const ownerId = req.user._id;
      console.log(ownerId, 'real owner');

      const newStore = await StoreService.createStore(storeData, ownerId);

      res.status(201).json({
        status: 'success',
        message: 'Store created successfully!',
        data: newStore,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateStore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const storeData = plainToInstance(UpdateStoreDto, req.body);
      await validateEntity(storeData);
      const { id } = req.params;
      if (!id) {
        throw new AppError('Store ID is required', 400);
      }
      const ownerId = req.user._id;
      const updatedStore = await StoreService.updateStore(
        id,
        storeData,
        ownerId,
      );
      res.status(200).json({
        success: true,
        message: 'Store updated successfully',
        data: updatedStore,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteStore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError('Store ID is required', 400);
      }
      const ownerId = req.user._id;
      const store = await StoreService.deleteStore(id, ownerId);
      res.status(200).json({
        success: true,
        message: store.message
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllStore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const allStores = await StoreService.getAllStores();
      res.status(200).json({
        success: true,
        message: 'Store deleted successfully',
        data: allStores,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const storeController = new StoreController();
