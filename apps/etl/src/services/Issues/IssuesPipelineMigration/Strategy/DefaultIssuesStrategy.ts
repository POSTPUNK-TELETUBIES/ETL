import { IssueETLParticipants, IssuePipelineMigrationStrategy } from ".";
import { issueModel } from "../../../../data/models/issue";
import { resolvePaging } from "../../../../utils";

export class DefaultIssuesStrategy implements IssuePipelineMigrationStrategy{
  constructor(
    private participants: IssueETLParticipants
  ){}

  async partiallyMigrateByProjectKey(projectKey: string, page  =1 ){
    const { issues, paging } = await this
      .participants
      .dataSource
      .fetchers
      .issues
      .search({
        componentKeys: [projectKey],
        p: page
      })
  
    const transformedIssues = this
      .participants
      .transformer
      .resolveRawDataToIssues(issues)

    await this
      .participants
      .dataLoader
      .createMany(transformedIssues)

    return paging
  }

  async migrateByProjectKey(projectKey: string) {
    const paging = await this.partiallyMigrateByProjectKey(projectKey)

    const leftPages = resolvePaging(paging)

    for(let i = 2; i <= leftPages; i++){
      await this.partiallyMigrateByProjectKey(projectKey, i)
    }

  }
  async migrateAll() {
    const issueSonarKeys: string[] = await issueModel.distinct('sonarKey')

    for(const sonarKey of issueSonarKeys){
      await this.migrateByProjectKey(sonarKey)
    }
  } 
}