import 'reflect-metadata';
import { Container } from "inversify";
import { ContainerTags, NewContainerTags } from "../types";
import { ErrorHandlingItemConfig } from "../errors";
import { 
  IssuesTransformer, 
  DefaultIssuesStrategy,
  DefaultIssueDataLoaderStrategy,
  IssueETLParticipants,
  IssuePipelineMigrationStrategy,
  IssuePipelineMigrationStrategyProxy 
} from "../services/Issues";

import { container } from ".";


export const newContainer = new Container({
  autoBindInjectable: true,
  defaultScope: 'Singleton'
});


newContainer
  .bind(IssuesTransformer)
  .toSelf()

newContainer
  .bind(NewContainerTags.ISSUES_DATA_LOADER)
  .to(DefaultIssueDataLoaderStrategy)

newContainer
  .bind<IssueETLParticipants>(NewContainerTags.ISSUES_PIPELINE_PARTICIPANTS)
  .toConstantValue({
    dataLoader: newContainer.get(NewContainerTags.ISSUES_DATA_LOADER),
    dataSource: container.get(ContainerTags.SonarClient),
    transformer: newContainer.get(IssuesTransformer)
  })

newContainer
  .bind(DefaultIssuesStrategy)
  .toSelf()

type ErrorHandler = ErrorHandlingItemConfig<IssuePipelineMigrationStrategy>

newContainer
  .bind<ErrorHandler[]>(NewContainerTags.ISSUES_PIPELINE_CONFIG)
  .toConstantValue([{
    item: newContainer.get(DefaultIssuesStrategy),
    continueOnError: false,
  }])

newContainer
  .bind(NewContainerTags.ISSUES_PIPELINE_STRATEGY)
  .to(IssuePipelineMigrationStrategyProxy)