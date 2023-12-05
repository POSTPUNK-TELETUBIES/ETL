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
  IssueMigrationProxyErrorsStrategy
} from "../services/Issues";

import { container } from ".";

/**
 * This container was created because the issues module got a refactor
 * and the old container was preserved to avoid breaking changes with projects migrations
 * @todo refactor container architecture to have global parents
 * in case you are new with Inversion of Control and containers
 * you should see
 * @link https://martinfowler.com/articles/injection.html
 * @todo create documentation about IoC and Dependency Injection in this project
 */
export const issuesModuleContainer = new Container({
  autoBindInjectable: true,
  defaultScope: 'Singleton'
});


issuesModuleContainer
  .bind(IssuesTransformer)
  .toSelf()

issuesModuleContainer
  .bind(NewContainerTags.ISSUES_DATA_LOADER)
  .to(DefaultIssueDataLoaderStrategy)

issuesModuleContainer
  .bind<IssueETLParticipants>(NewContainerTags.ISSUES_PIPELINE_PARTICIPANTS)
  .toConstantValue({
    dataLoader: issuesModuleContainer.get(NewContainerTags.ISSUES_DATA_LOADER),
    dataSource: container.get(ContainerTags.SonarClient),
    transformer: issuesModuleContainer.get(IssuesTransformer)
  })

issuesModuleContainer
  .bind(DefaultIssuesStrategy)
  .toSelf()

type ErrorHandler = ErrorHandlingItemConfig<IssuePipelineMigrationStrategy>

issuesModuleContainer
  .bind<ErrorHandler[]>(NewContainerTags.ISSUES_PIPELINE_CONFIG)
  .toConstantValue([{
    item: issuesModuleContainer.get(DefaultIssuesStrategy),
    continueOnError: false,
  }])

issuesModuleContainer
  .bind(NewContainerTags.ISSUES_PIPELINE_STRATEGY)
  .to(IssueMigrationProxyErrorsStrategy)