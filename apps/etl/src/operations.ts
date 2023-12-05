import { mkdir, writeFile } from 'node:fs/promises';
import { container } from "./modules";
import { Reports } from "./services/Reports";
import { SonarqubeToDatabase } from "./services/SonarqubeToDatabase";
import { ContainerTags, NewContainerTags, Operations } from "./types";
import { executeWithTimeLogger } from "./utils";
import { logger } from './global';
import { issuesModuleContainer } from './modules/newContainer';
import { IssuePipelineMigrationStrategy } from './services/Issues';

export const operationsByName = {
  [Operations.ProjectMigrations]: async () => {
    await executeWithTimeLogger(async () => {
      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateProjects();
    }
    )
  },
  [Operations.MetricsMigrations]: async () => {
    await executeWithTimeLogger(async () => {
      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateMetrics();
    })
  },
  [Operations.CoverageReports]: async () => {
    await executeWithTimeLogger(async () => {
      const dataCsv = await container
        .get<Reports>(Reports)
        .getCoverageMetrics();
      await mkdir('./csv', { recursive: true });
      await writeFile('./csv/coverageMetrics.csv', dataCsv);
    })
  },
  [Operations.DuplicationReports]: async () => {
    await executeWithTimeLogger(async () => {
      const dataCsv = await container
        .get<Reports>(Reports)
        .getDuplicationMetrics();
      await mkdir('./csv', { recursive: true });
      await writeFile('./csv/duplicationMetrics.csv', dataCsv);
    })
  },
  [Operations.IssuesMigrations]: async () => {
    await executeWithTimeLogger(async () =>
      await issuesModuleContainer
        .get<IssuePipelineMigrationStrategy>(NewContainerTags.ISSUES_PIPELINE_STRATEGY)
        .migrateAll()
    )
  },
  [Operations.Exit]: () => {
    logger.info('Saliendo');
    process.exit(0);
  },
};