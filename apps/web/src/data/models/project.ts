import mongoose from 'mongoose';
import { coverageSchema } from './coverage';
import { duplicationSchema } from './duplication';
const { Schema } = mongoose;

export const projectSchema = new Schema({
  sonarKey: { type: String, required: true, unique: true },
  tribe: { type: String },
  squad: { type: String },
  name: { type: String },
  analysisDate: { type: Date },
  coverageMetrics: { type: coverageSchema },
  duplicationMetrics: { type: duplicationSchema },
});

export const Project = mongoose.model('Project', projectSchema);
