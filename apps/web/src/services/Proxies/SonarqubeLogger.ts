import { Component, Metrics } from 'sonar-sdk';
import {
  FetchingStrategy,
  ISonarqubeService,
  SonarqubeService,
} from '../Sonarqube';
import pino, { destination } from 'pino';
import { inject, injectable } from 'inversify';
import { ContainerTags } from '../../types';

const logger = pino(destination({ dest: './logs/sonarLogger.log' }));

@injectable()
export class SonarqubeLogger implements ISonarqubeService {
  constructor(
    @inject(ContainerTags.Sonarqube)
    private originalService: SonarqubeService,
    @inject(ContainerTags.SonarqubeLoggerIsOn) private isOn: boolean = false
  ) {}
  async getAllProjects(): Promise<Component[]> {
    const projects = await this.originalService.getAllProjects();
    if (this.isOn) logger.info(projects);

    return projects;
  }
  getMetricsByKeys(keys: string[]): Promise<Metrics[]> {
    const metrics = this.originalService.getMetricsByKeys(keys);
    if (this.isOn) logger.info(metrics);
    return metrics;
  }
  setFetchingStrategy(strategy: FetchingStrategy): void {
    this.originalService.setFetchingStrategy(strategy);
  }
}
