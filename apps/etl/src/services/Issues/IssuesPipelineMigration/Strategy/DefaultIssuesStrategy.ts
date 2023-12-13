import { inject, injectable } from "inversify";
import { IssueETLParticipants, IssuePipelineMigrationStrategy } from ".";
import { resolvePaging } from "../../../../utils/fetch";
import { NewContainerTags } from "../../../../types";
import { Project } from "../../../../data/models/project";

@injectable()
export class DefaultIssuesStrategy implements IssuePipelineMigrationStrategy {
  constructor(
    @inject(NewContainerTags.ISSUES_PIPELINE_PARTICIPANTS)
    private participants: IssueETLParticipants
  ) { }

  async partiallyMigrateByProjectKey(projectKey: string, page = 1) {
    const { issues, paging } = await this
      .participants
      .dataSource
      .fetchers
      .issues
      .search({
        componentKeys: [projectKey],
        p: page,
        ps: 500
      })

    const transformedIssues = this
      .participants
      .transformer
      .resolveRawIssuesToIssues(issues)

    await this
      .participants
      .dataLoader
      .createMany(transformedIssues)

    return paging
  }

  async migrateByProjectKey(projectKey: string) {
    const paging = await this.partiallyMigrateByProjectKey(projectKey)

    const leftPages = resolvePaging(paging)

    for (let i = 2; i <= leftPages; i++) {
      await this.partiallyMigrateByProjectKey(projectKey, i)
    }

  }
  async migrateAll() {
    const issueSonarKeys: string[] = await Project.distinct('sonarKey')

    for (const sonarKey of issueSonarKeys) {
      await this.migrateByProjectKey(sonarKey)
    }
  }
}