import mongoose from 'mongoose';
import { ICoverage, coverageSchema } from './coverage';
import { IDuplication, duplicationSchema } from './duplication';
const { Schema } = mongoose;

export interface IProject {
  sonarKey: string;
  tribe: string;
  squad: string;
  name: string;
  analysisDate: Date;
  coverageMetrics: ICoverage;
  duplicationMetrics: IDuplication;
  createdAt: Date;
  updatedAt: Date;
}

export const projectSchema = new Schema(
  {
    sonarKey: { type: String, required: true, unique: true },
    tribe: { type: String },
    squad: { type: String },
    name: { type: String },
    analysisDate: { type: Date },
    coverageMetrics: { type: coverageSchema },
    duplicationMetrics: { type: duplicationSchema },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
