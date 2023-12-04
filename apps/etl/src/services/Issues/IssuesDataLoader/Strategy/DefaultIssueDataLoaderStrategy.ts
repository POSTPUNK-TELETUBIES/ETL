import { IIssue, issueModel } from "../../../../data/models/issue";
import { IssueDataLoaderStrategy } from "./type";

export class DefaultIssueDataLoaderStrategy implements IssueDataLoaderStrategy{
  // TODO: Omit issues the already where created
  async createMany(data: Partial<IIssue>[]) {
    return await issueModel.insertMany(data)
  }
}