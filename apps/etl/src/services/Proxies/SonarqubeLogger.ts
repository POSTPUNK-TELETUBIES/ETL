import { Component, Metrics } from 'sonar-sdk';
import {
  FetchingStrategy,
  FetchMetricsAndProjects,
  SonarqubeService,
} from '../Sonarqube';
import pino, { destination, Logger } from 'pino';
import { inject, injectable } from 'inversify';
import { ContainerTags } from '../../types';
import { env } from '../../config';

interface SonarqubeLoggerOptions {
  isOn?: boolean;
  logger?: Logger
}


@injectable()
export class SonarqubeLogger implements FetchMetricsAndProjects {
  private static defaultOptions: SonarqubeLoggerOptions = {
    logger: pino(destination({ dest: `${env.sonarQubeLogs}`, sync: true })),
    isOn: false,
  };

  constructor(
    @inject(SonarqubeService)
    private originalService: SonarqubeService,
    @inject(ContainerTags.Options) private options = SonarqubeLogger.defaultOptions
  ) {
    this.options = { ...SonarqubeLogger.defaultOptions, ...options }
  }

  private logInfoIfIsOn(data: unknown) {
    if (this.options.isOn)
      this.options.logger?.info(data);
  }

  async getAllProjects(): Promise<Component[]> {
    const projects = await this.originalService.getAllProjects();

    this.logInfoIfIsOn(projects)

    return projects;
  }

  getMetricsByKeys(keys: string[]): Promise<Metrics[]> {
    const metrics = this.originalService.getMetricsByKeys(keys);

    this.logInfoIfIsOn(metrics);

    return metrics;
  }

  setFetchingStrategy(strategy: FetchingStrategy): void {
    this.originalService.setFetchingStrategy(strategy);
  }
}
