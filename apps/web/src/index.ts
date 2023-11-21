import 'reflect-metadata';
import { connect } from './services/Connection';
import { Project } from './data/models/project';
import { select } from '@inquirer/prompts';
import { ContainerTags, Operations } from './types';
import { Container } from 'inversify';
import { env } from './config';
import {
  ConcurrentFetchingStrategy,
  SonarqubeService,
} from './services/Sonarqube';
import { SonarqubeSdk } from 'sonar-sdk';
import { SonarqubeToDatabase } from './services/SonarqubeToDatabase';
import pino, { destination } from 'pino';
import { Reports } from './services/Reports';
import { writeFile, mkdir } from 'node:fs/promises';
import { SonarqubeLogger } from './services/Proxies/SonarqubeLogger';

const logger = pino(destination({ dest: `${env.logFolder}/log.log` }));

const container = new Container();

container.bind(ContainerTags.Options).toConstantValue({
  baseURL: env.apiBaseUrl,
  auth: {
    username: env.sonarToken,
    password: '',
  },
});

container
  .bind<SonarqubeSdk>(ContainerTags.SonarClient)
  .toConstantValue(new SonarqubeSdk(container.get(ContainerTags.Options)));

const currentStrategy = new ConcurrentFetchingStrategy(
  container.get(ContainerTags.SonarClient)
);

container
  .bind<SonarqubeService>(ContainerTags.Sonarqube)
  .to(SonarqubeService)
  .inSingletonScope();

container
  .get<SonarqubeService>(ContainerTags.Sonarqube)
  .setFetchingStrategy(currentStrategy);

container.bind<typeof Project>(ContainerTags.Project).toConstantValue(Project);
container
  .bind(ContainerTags.SonarqubeMigrations)
  .to(SonarqubeToDatabase)
  .inSingletonScope();

container.bind(ContainerTags.Reports).to(Reports).inSingletonScope();
container.bind(ContainerTags.SonarqubeLoggerIsOn).toConstantValue(true);
container
  .bind(ContainerTags.ProxySonarClient)
  .to(SonarqubeLogger)
  .inSingletonScope();

async function executeWithTime<T = unknown>(callback: () => Promise<T>) {
  const initTime = Date.now()
  await callback()
  console.log(`\nDuracion: ${(Date.now() - initTime)/1000} segundos\n`)
}

const operations = {
  [Operations.ProjectMigrations]: async () => {
  executeWithTime(async () => {
      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateProjects();
    }
    )
  },
  [Operations.MetricsMigrations]: async () => {
    executeWithTime(async () => {
      await container
      .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
      .migrateMetrics();
    })
  },
  [Operations.CoverageReports]: async () => {
    executeWithTime(async () => {
      const dataCsv = await container
      .get<Reports>(ContainerTags.Reports)
      .getCoverageMetrics();
    await mkdir('./csv', { recursive: true });
    await writeFile('./csv/coverageMetrics.csv', dataCsv);
    })
  },
  [Operations.DuplicationReports]: async () => {
    executeWithTime(async () => {
      const dataCsv = await container
      .get<Reports>(ContainerTags.Reports)
      .getDuplicationMetrics();
    await mkdir('./csv', { recursive: true });
    await writeFile('./csv/duplicationMetrics.csv', dataCsv);
    })
  },
  [Operations.Exit]: () => {
    console.log('Saliendo');
    process.exit(0);
  },
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
  getAnswer();
};

const init = async () => {
  console.log('inicializando conexion');
  await connect();
  getAnswer();
};

init();
