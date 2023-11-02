import mongoose from 'mongoose';
const { Schema } = mongoose;

export const duplicationSchema = new Schema(
  {
    totalDensityPercent: { type: Number },
    duplicatedLines: { type: Number },
    duplicatedBlocks: { type: Number },
    duplicatedFiles: { type: Number },
  },
  {
    timestamps: true,
  }
);
