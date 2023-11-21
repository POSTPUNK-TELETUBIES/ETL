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

interface objOptions{
  projects: Component[],
  metrics: Promise<Metrics[]>
}

enum keyOptions{
  METRICS = 'metrics',
  PROJECTS = 'projects'
}

@injectable()
export class SonarqubeLogger implements FetchMetricsAndProjects {
  constructor(
    @inject(ContainerTags.Sonarqube)
    private originalService: SonarqubeService,
    @inject(ContainerTags.SonarqubeLoggerIsOn) private isOn: boolean = false
  ) {}

    private checkIsOn(option:keyof objOptions){
      if(this.isOn){
        logger.info(option);
      }
    }

  async getAllProjects(): Promise<Component[]> {
    const projects = await this.originalService.getAllProjects();
    this.checkIsOn(keyOptions.PROJECTS)

    return projects;
  }
  getMetricsByKeys(keys: string[]): Promise<Metrics[]> {
    const metrics = this.originalService.getMetricsByKeys(keys);
    this.checkIsOn(keyOptions.METRICS)

    return metrics;
  }
  setFetchingStrategy(strategy: FetchingStrategy): void {
    this.originalService.setFetchingStrategy(strategy);
  }
}
