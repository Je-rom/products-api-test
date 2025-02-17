import { StoreModel } from '../models/store.model';
import { CreateStoreDto } from '../dtos/storeDto/createStore.dto';
import { AppError } from '../utils/appError';
import { UpdateStoreDto } from '../dtos/storeDto/updateStore.dto';

export class StoreService {
  public static async createStore(storeData: CreateStoreDto, ownerId: string) {
    const ifStoreExist = await StoreModel.findOne({ name: storeData.name });
    if (ifStoreExist) {
      throw new AppError('Store already exists with that name', 400);
    }
    const newStore = await StoreModel.create({ ...storeData, owner: ownerId });
    return newStore;
  }

  public static async getAllStores() {
    const stores = await StoreModel.find({ isDeleted: { $ne: true } });
    return stores;
  }

  public static async updateStore(
    storeId: string,
    updateData: UpdateStoreDto,
    ownerId: string,
  ) {
    //if store that belongs to the owner
    const store = await StoreModel.findOne({
      _id: storeId,
      owner: ownerId,
      isDeleted: { $ne: true },
    });

    if (!store) {
      throw new AppError(
        'Store not found or you are not authorized to update it',
        404,
      );
    }

    //check if name is being updated and already exists
    if (updateData.name) {
      const existingStore = await StoreModel.findOne({
        name: updateData.name,
        _id: { $ne: storeId }, //excude the current store from the check
      });

      if (existingStore) {
        throw new AppError('A store with this name already exists', 400);
      }
    }

    Object.assign(store, updateData);
    await store.save();
    return store;
  }

  public static async deleteStore(storeId: string, ownerId: string) {
    const store = await StoreModel.findOne({
      _id: storeId,
      owner: ownerId,
      isDeleted: { $ne: true },
    });

    if (!store) {
      throw new AppError(
        'Store not found or you are not authorized to delete it',
        404,
      );
    }

    store.isDeleted = true;
    await store.save();
    return { message: 'Store deleted successfully' };
  }
}
