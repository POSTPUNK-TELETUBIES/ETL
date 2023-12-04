import { SonarqubeClient } from "sonar-sdk";
import { IssueDataLoaderStrategy } from "../../IssuesDataLoader";
import { IssuesTransformer } from "../../IssuesTransformer";

export interface IssueETLParticipants{
    dataSource: SonarqubeClient;
    dataLoader: IssueDataLoaderStrategy;
    transformer: IssuesTransformer;
}

export interface IssuePipelineMigrationStrategy{
  migrateByProjectKey(projectKey: string): Promise<unknown>
  migrateAll(): Promise<unknown>
}