import 'reflect-metadata';
import { connect } from './services/Connection';

import { select } from '@inquirer/prompts';
import { ContainerTags, NewContainerTags, Operations } from './types';
import { SonarqubeToDatabase } from './services/SonarqubeToDatabase';
import { Reports } from './services/Reports';
import { writeFile, mkdir } from 'node:fs/promises';
import { logger } from './global';
import { container } from './modules';
import { executeWithTime } from './utils';
import { newContainer } from './modules/newContainer';
import { IssuePipelineMigrationStrategy } from './services/Issues/IssuesPipelineMigration/Strategy';

const operations = {
  [Operations.ProjectMigrations]: async () => {
    await executeWithTime(async () => {
      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateProjects();
    }
    )
  },
  [Operations.MetricsMigrations]: async () => {
    await executeWithTime(async () => {
      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateMetrics();
    })
  },
  [Operations.CoverageReports]: async () => {
    await executeWithTime(async () => {
      const dataCsv = await container
        .get<Reports>(Reports)
        .getCoverageMetrics();
      await mkdir('./csv', { recursive: true });
      await writeFile('./csv/coverageMetrics.csv', dataCsv);
    })
  },
  [Operations.DuplicationReports]: async () => {
    await executeWithTime(async () => {
      const dataCsv = await container
        .get<Reports>(Reports)
        .getDuplicationMetrics();
      await mkdir('./csv', { recursive: true });
      await writeFile('./csv/duplicationMetrics.csv', dataCsv);
    })
  },
  [Operations.Exit]: () => {
    logger.info('Saliendo');
    process.exit(0);
  },
  [Operations.IssuesMigrations]: async ()=>{
    await executeWithTime(async()=>
      await newContainer
        .get<IssuePipelineMigrationStrategy>(NewContainerTags.ISSUES_PIPELINE_STRATEGY)
        .migrateAll()
    )
  }
};

const mainSelect = async () => {
  return await select({
    message: 'Seleccione una operacion:',
    choices: [
      {
        name: 'Migracion de proyectos',
        value: Operations.ProjectMigrations,
      },
      {
        name: 'Migracion de metricas',
        value: Operations.MetricsMigrations,
      },
      {
        name: 'Generar reportes de coverage',
        value: Operations.CoverageReports,
      },
      {
        name: 'Generar reportes de duplicacion',
        value: Operations.DuplicationReports,
      },
      {
        name: 'Migrar Issues',
        value: Operations.IssuesMigrations,
      },
      {
        name: 'Salir',
        value: Operations.Exit,
      },
    ],
  });
};

const getAnswer = async () => {
  const answer = await mainSelect();

  try {
    await operations[answer]();
  } catch (error) {
    logger.error(error);
    console.log('Ocurrio un error');
  }
  await getAnswer();
};

const init = async () => {
  console.log('inicializando conexion');
  await connect();
  await getAnswer();
};

init();
