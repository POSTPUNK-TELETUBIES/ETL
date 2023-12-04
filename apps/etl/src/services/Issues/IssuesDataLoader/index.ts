import { IIssue } from "../../../data/models/issue";

export interface IssueDataLoaderStrategy{
  createMany(data: Partial<IIssue>[]):Promise<unknown>;
}