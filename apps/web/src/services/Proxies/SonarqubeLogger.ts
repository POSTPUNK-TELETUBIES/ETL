import { Component, Metrics } from 'sonar-sdk';
import {
  FetchingStrategy,
  FetchMetricsAndProjects,
  SonarqubeService,
} from '../Sonarqube';
import pino, { destination } from 'pino';
import { inject, injectable } from 'inversify';
import { ContainerTags } from '../../types';
import { env } from '../../config';

const logger = pino(destination({ dest: `${env.logFolder}/sonarLogger.log` }));

@injectable()
export class SonarqubeLogger implements FetchMetricsAndProjects {
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
