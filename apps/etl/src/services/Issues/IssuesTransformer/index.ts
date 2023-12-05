import { Issue } from "sonar-sdk";
import { IIssue } from "../../../data/models/issue";
import { Severity, TypeIssue } from "../../../types/issues";
import { injectable } from "inversify";

@injectable()
export class IssuesTransformer {
  // TODO: refactor when IIsue is ready
  resolveRawDataToIssue(rawData: Issue): Partial<IIssue> {
    return {
      keyIssue: rawData.key,
      observation: rawData.type as TypeIssue,
      problemDescription: rawData.message,
      severity: rawData.severity as Severity,
      language: rawData.rule.split(':')[0],
      ruleCode: rawData.rule,
      startLine: rawData.line,
      issueCreatedAt: new Date(rawData.creationDate),
      issueUpdatedAt: new Date(rawData.updateDate),
      sonarHash: rawData.hash,
      status: rawData.status,
      scope: rawData.scope,
      tags: rawData.tags,
      project: rawData.project,
      commitDate: new Date(rawData.updateDate),
    }
  }

  resolveRawIssuesToIssues(rawIssues: Issue[]): Partial<IIssue>[] {
    return rawIssues.map(rawIssue => this.resolveRawDataToIssue(rawIssue))
  }
}