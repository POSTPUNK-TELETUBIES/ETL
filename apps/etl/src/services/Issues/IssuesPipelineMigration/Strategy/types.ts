import { SonarqubeClient } from "sonar-sdk";
import { IssueDataLoaderStrategy } from "../../IssuesDataLoader";

export interface IssueETLParticipants{
    dataSource: SonarqubeClient;
    dataLoader: IssueDataLoaderStrategy;
    transformer: IssueTransformer;
}

export interface IssuePipelineMigrationStrategy{
  migrateByProjectKey(projectKey: string): Promise<unknown>
  migrateAll(): Promise<unknown>
}