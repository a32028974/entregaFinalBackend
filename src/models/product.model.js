import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  status: { type: Boolean, default: true },
  stock: Number,
  code: { type: String, unique: true },
  thumbnails: [String]
});

productSchema.plugin(mongoosePaginate); // 👈 ESTA LÍNEA ES CLAVE

export const ProductModel = mongoose.model('Product', productSchema);
