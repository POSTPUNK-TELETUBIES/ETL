import 'reflect-metadata';
import { Container } from "inversify";
import { ContainerTags } from "../types";
import { SonarqubeSdk } from "sonar-sdk";
import { ConcurrentFetchingStrategy, SonarqubeService } from "../services/Sonarqube";
import { Project } from "../data/models/project";
import { SonarqubeToDatabase } from "../services/SonarqubeToDatabase";
import { Reports } from "../services/Reports";
import { SonarqubeLogger } from "../services/Proxies/SonarqubeLogger";
import { env } from '../config';

export const container = new Container();

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
  .bind<SonarqubeService>(SonarqubeService)
  .toSelf()
  .inSingletonScope();

container
  .get<SonarqubeService>(SonarqubeService)
  .setFetchingStrategy(currentStrategy);

container.bind<typeof Project>(ContainerTags.Project).toConstantValue(Project);
container
  .bind(ContainerTags.SonarqubeMigrations)
  .to(SonarqubeToDatabase)
  .inSingletonScope();

container.bind(Reports).toSelf().inSingletonScope();

container.bind(ContainerTags.SonarqubeLoggerOptions).toConstantValue({
  isOn: true,
});

container
  .bind(ContainerTags.ProxySonarClient)
  .to(SonarqubeLogger)
  .inSingletonScope();