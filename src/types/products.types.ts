import { IStore } from './store.types';
import { IUser } from './user.types';

export interface IProduct {
  _id: string;
  product_name: string;
  product_price: number;
  storeId: IStore;
  userId: IUser;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
