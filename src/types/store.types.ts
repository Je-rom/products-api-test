import { IUser } from './user.types';

export interface IStore {
  _id: string;
  name: string;
  description: string;
  owner: string | IUser;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
