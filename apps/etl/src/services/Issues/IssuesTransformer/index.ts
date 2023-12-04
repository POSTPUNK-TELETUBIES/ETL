import { Issue } from "sonar-sdk";
import { IIssue } from "../../../data/models/issue";

export class IssuesTransformer{
  // TODO: refactor when IIsue is ready
  resolveRawDataToIssue(rawData: Issue): Partial<IIssue>{
    return {
      ...rawData
    }
  }

  resolveRawIssuesToIssues(rawIssues: Issue[]): Partial<IIssue>[]{
    return rawIssues.map(rawIssue => this.resolveRawDataToIssue(rawIssue))
  }
}