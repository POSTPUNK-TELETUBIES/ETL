import mongoose, { Schema } from "mongoose";
import { Severity, TypeIssue } from "../../types/issues";

export interface IIssue {
  keyIssue: string;
  observation: TypeIssue;
  problemDescription: string;
  severity: Severity;
  language?: string;
  ruleCode?: string;
  startLine?: number;
  developerEmail?: string;
  issueCreatedAt?: Date;
  issueUpdatedAt?: Date;
  sonarHash?: string;
  status?: string;
  scope?: string;
  tags?: string[];
  file?: string;
  project?: string;
  commitDate?: Date;
}

export const issueSchema = new Schema<IIssue>({
  keyIssue: { type: String },
  observation: { type: String },
  problemDescription: { type: String },
  severity: { type: String },
  language: { type: String },
  ruleCode: { type: String },
  startLine: { type: Number },
  developerEmail: { type: String },
  issueCreatedAt: { type: Date },
  issueUpdatedAt: { type: Date },
  sonarHash: { type: String },
  status: { type: String },
  scope: { type: String },
  tags: { type: Array, "default": [] },
  file: { type: String },
  project: { type: String },
  commitDate: { type: Date },
})

export const issueModel = mongoose.model('Issue', issueSchema)
