import mongoose from 'mongoose';
const { Schema } = mongoose;

export const coverageSchema = new Schema(
  {
    totalCoveragePercent: { type: Number },
    linesToCover: { type: Number },
    linesNoCover: { type: Number },
    linesCoveragePercent: { type: Number },
    qtyConditionsToCover: { type: Number },
    qtyConditionsNoCover: { type: Number },
    conditionsCoveragePercentage: { type: Number },
  },
  {
    timestamps: true,
  }
);
