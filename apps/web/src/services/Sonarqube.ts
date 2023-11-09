import { Component, Metrics, SonarqubeClient } from 'sonar-sdk';
import { resolvePaging } from '../utils';
import { inject, injectable } from 'inversify';
import {
  ContainerTags,
  CoverageMetricKeys,
  DuplicationMetricKeys,
} from '../types';

export interface FetchingStrategy {
  getLeftProjects(leftPageCount: number): Promise<Component[]>;
}

export interface ISonarqubeService {
  getAllProjects(): Promise<Component[]>;
  getMetricsByKeys(keys: string[]): Promise<Metrics[]>;
  setFetchingStrategy(strategy: FetchingStrategy): void;
}

@injectable()
export class SonarqubeService implements ISonarqubeService {
  private fetchingStrategy?: FetchingStrategy;

  constructor(
    @inject(ContainerTags.SonarClient) protected client: SonarqubeClient
  ) {}

  setFetchingStrategy(strategy: FetchingStrategy) {
    this.fetchingStrategy = strategy;
  }

  async getAllProjects() {
    const { paging, components } = await this.client.searchProjects(
      1,
      'analysisDate'
    );

    const leftPageCount = resolvePaging(paging) - 1;

    if (!this.fetchingStrategy)
      throw new Error('Fetching strategy not defined');

    const leftProjects =
      await this.fetchingStrategy.getLeftProjects(leftPageCount);

    return components.concat(leftProjects);
  }

  async getMetricsByKeys(keys: string[]) {
    const { measures } = await this.client.searchMetrics(keys, [
      ...Object.values(CoverageMetricKeys),
      ...Object.values(DuplicationMetricKeys),
    ]);

    return measures;
  }
}

export class ClassicFetchingStrategy implements FetchingStrategy {
  constructor(private client: SonarqubeClient) {}

  async getLeftProjects(leftPageCount: number) {
    let result: Component[] = [];
    for (let i = 0; i < leftPageCount; i++) {
      const { components } = await this.client.searchProjects(
        i + 2,
        'analysisDate'
      );
      result = result.concat(components);
    }
    return result;
  }
}

export class ConcurrentFetchingStrategy implements FetchingStrategy {
  constructor(private client: SonarqubeClient) {}

  async getLeftProjects(leftPageCount: number) {
    return (
      await Promise.all(
        Array.from({ length: leftPageCount }).map(async (_, index) => {
          const { components } = await this.client.searchProjects(
            index + 2,
            'analysisDate'
          );
          return components;
        })
      )
    ).flat();
  }
}
