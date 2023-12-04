import mongoose, { Schema } from "mongoose";
import { Severity, TypeIssue } from "../../types/issues";

export interface IIssue {
  sonarKey: string;
  observation: TypeIssue;
  severity: Severity;
  language?: string;
  rule?: string;
  startLine?: number;
  developerEmail?: string;
  issueCreatedAt?: Date;
  issueUpdatedAt?: Date;
  sonarHash?: string;
  status?: string;
  scope?: string;
  tags?: string[];
  sonarRuleMessage?: string;
  file?: string;
  project?: string;
  commitDate?: Date;
}

export const issueSchema = new Schema({
  sonarKey: { type: String },
  observation: { type: TypeIssue },
  severity: { type: Severity },
  language: { type: String },
  rule: { type: String },
  startLine: { type: Number },
  developerEmail: { type: String },
  issueCreatedAt: { type: Date },
  issueUpdatedAt: { type: Date },
  sonarHash: { type: String },
  status: { type: String },
  scope: { type: String },
  tags: { type: Array, "default": [] },
  sonarRuleMessage: { type: String },
  file: { type: String },
  project: { type: String },
  commitDate: { type: Date },
})

export const issueModel = mongoose.model('Issue', issueSchema)
