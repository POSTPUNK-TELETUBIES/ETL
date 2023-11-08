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

const init = async () => {
  console.log('inicializando conexion');
  await connect();
  const answer = await select({
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
    ],
  });

  if (answer === Operations.ProjectMigrations) {
    try {
      console.log('Iniciando Migracion');
      console.time('Duracion');

      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateProjects();
      console.timeEnd('Duracion');
      console.log('Migracion finalizada');
    } catch (_error) {
      console.log(_error);
      console.log('Ups Algo salio mal!');
    }
    process.exit(0);
  }

  if (answer === Operations.MetricsMigrations) {
    try {
      console.log('Iniciando Migracion');
      console.time('Duracion');

      await container
        .get<SonarqubeToDatabase>(ContainerTags.SonarqubeMigrations)
        .migrateMetrics();
      console.timeEnd('Duracion');
      console.log('Migracion finalizada');
    } catch (_error) {
      console.log(_error);
      console.log('Ups Algo salio mal!');
    }
    process.exit(0);
  }
};

init();
