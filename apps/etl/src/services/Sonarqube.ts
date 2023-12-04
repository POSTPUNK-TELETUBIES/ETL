import { Component, Metrics, SonarqubeClient, Issue } from 'sonar-sdk';
import { getLeftData, resolvePaging } from '../utils/fetch';
import { inject, injectable } from 'inversify';
import {
  ContainerTags,
  CoverageMetricKeys,
  DuplicationMetricKeys,
} from '../types';


export interface FetchingStrategy {
  getLeftProjects(leftPageCount: number): Promise<Component[]>;
  getLeftIssues(leftPageCount: number, projectKey: string): Promise<Issue[]>
}

export interface SonarQubeFetchService {
  getAllProjects(): Promise<Component[]>;
  getMetricsByKeys(keys: string[]): Promise<Metrics[]>;
  getIssueByProject(projectKey: string): Promise<Issue[]>;
  setFetchingStrategy(strategy: FetchingStrategy): void;
}

export class ClassicFetchingStrategy implements FetchingStrategy {
  constructor(private client: SonarqubeClient) {}

  getLeftIssues(leftPageCount: number, projectKey: string): Promise<Issue[]> {
    return getLeftData<Issue>(leftPageCount, async (i)=>{
      const { issues } = await this
      .client
      .fetchers
      .issues
      .search({
        componentKeys: [projectKey],
        p: i + 2,
        ps: 500
      });

      return issues;
    })
  }

  async getLeftProjects(leftPageCount: number) {
    return getLeftData<Component>(leftPageCount, async (i)=>{
      const { components } = await this
      .client
      .fetchers
      .components
      .searchProjects(
        i + 2,
        'analysisDate'
      );

      return components;
    })
  }
}


@injectable()
export class SonarqubeService implements SonarQubeFetchService {
  private fetchingStrategy: FetchingStrategy;

  constructor(
    @inject(ContainerTags.SonarClient) protected client: SonarqubeClient
  ) {
    this.fetchingStrategy = new ClassicFetchingStrategy(client);
  }

  setFetchingStrategy(strategy: FetchingStrategy) {
    this.fetchingStrategy = strategy;
  }

  async getAllProjects() {
    const { paging, components } = await this.client
      .fetchers
      .components
      .searchProjects(
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
    const { measures } = await this
      .client
      .fetchers
      .metrics
      .search(keys, [
      ...Object.values(CoverageMetricKeys),
      ...Object.values(DuplicationMetricKeys),
    ]);

    return measures;
  }

  async getIssueByProject(projectKey: string){
    const { issues,  paging } = await this
      .client
      .fetchers
      .issues
      .search({
        componentKeys: [projectKey],
        p: 1,
        ps: 500
      })

    const leftPageCount = resolvePaging(paging) - 1;

    if (!this.fetchingStrategy)
      throw new Error('Fetching strategy not defined');
  
    const leftIssues =
      await this.fetchingStrategy.getLeftIssues(leftPageCount, projectKey);

    return issues.concat(leftIssues);
  }
}


export class ConcurrentFetchingStrategy implements FetchingStrategy {
  constructor(private client: SonarqubeClient) {}
  getLeftIssues(leftPageCount: number, projectKey: string): Promise<Issue[]> {
    throw new Error('Method not implemented.' + leftPageCount + projectKey);
  }

  async getLeftProjects(leftPageCount: number) {
    return (
      await Promise.all(
        Array.from({ length: leftPageCount }).map(async (_, index) => {
          const { components } = await this
            .client
            .fetchers
            .components
            .searchProjects(
              index + 2,
              'analysisDate'
            );
          return components;
        })
      )
    ).flat();
  }
}
