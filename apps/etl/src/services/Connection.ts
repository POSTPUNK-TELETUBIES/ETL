import mongoose from 'mongoose';
import { env } from '../config';

export async function connect() {
  return await mongoose.connect(env.uriMongo as string);
}
