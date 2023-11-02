import mongoose from 'mongoose';
import { coverageSchema } from './coverage';
const { Schema } = mongoose;

export const projectSchema = new Schema({
  sonarKey: { type: String, required: true, unique: true },
  appName: { type: String },
  tribe: { type: String },
  squad: { type: String },
  name: { type: String },
  analysisDate: { type: Date },
  coverageMetrics: { type: coverageSchema },
});
