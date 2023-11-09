import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ICoverage {
  totalCoveragePercent: number;
  linesToCover: number;
  linesNoCover: number;
  linesCoveragePercent: number;
  qtyConditionsToCover: number;
  qtyConditionsNoCover: number;
  conditionsCoveragePercentage: number;
}

export const coverageSchema = new Schema(
  {
    totalCoveragePercent: { type: Number }, //coverage
    linesToCover: { type: Number }, //lines_to_cover
    linesNoCover: { type: Number }, //uncovered_lines
    linesCoveragePercent: { type: Number }, //line_coverage
    qtyConditionsToCover: { type: Number }, //conditions_to_cover
    qtyConditionsNoCover: { type: Number }, //uncovered_conditions
    conditionsCoveragePercentage: { type: Number }, //branch_coverage
  },
  {
    timestamps: true,
  }
);

export const Coverage = mongoose.model('Coverage', coverageSchema);
