import mongoose, { Model, Schema } from 'mongoose';
import { IStore } from '../types/store.types';

const storeSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, 'Store name cannot be less than 3 characters'],
      maxlength: [50, 'Store name cannot be more than 50 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StoreModel: Model<IStore> = mongoose.model<IStore>(
  'Store',
  storeSchema,
);
