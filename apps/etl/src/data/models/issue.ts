import { Schema, model } from "mongoose";

export interface IIssue{}

export const issueSchema = new Schema({})

export const issueModel = model('Issue', issueSchema);