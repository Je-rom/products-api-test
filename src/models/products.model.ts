import mongoose, { Model, Schema } from 'mongoose';
import { IProduct } from '../types/products.types';

const productSchema = new Schema<IProduct>(
  {
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true, 
    },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
  'Product',
  productSchema,
);
