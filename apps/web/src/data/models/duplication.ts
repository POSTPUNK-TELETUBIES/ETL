import mongoose from 'mongoose';
const { Schema } = mongoose;

export const duplicationSchema = new Schema(
  {
    totalDensityPercent: { type: Number }, //duplicated_lines_density
    duplicatedLines: { type: Number }, //duplicated_lines
    duplicatedBlocks: { type: Number }, //duplicated_blocks
    duplicatedFiles: { type: Number }, //duplicated_files
  },
  {
    timestamps: true,
  }
);

export const Duplication = mongoose.model('Duplication', duplicationSchema);
