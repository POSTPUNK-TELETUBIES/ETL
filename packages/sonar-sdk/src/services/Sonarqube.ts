import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SonarQubeIssues } from './SonarQubeIssues';
import { SonarQubeMetrics } from './SonarQubeMetrics';
import { SonarQubeComponents } from './SonarQubeComponets';

interface SonarQubeFetchers {
  issues: SonarQubeIssues;
  metrics: SonarQubeMetrics;
  components: SonarQubeComponents;
}

export class SonarqubeClient {
  private pathClasses: SonarQubeFetchers;
  constructor(private client: AxiosInstance) {
    //TODO: violation open close principle
    if (!this.client.defaults.baseURL) throw new Error('baseURL is required');

    this.client.defaults.baseURL = this.resolveBaseUrl(
      this.client.defaults.baseURL
    );

    this.pathClasses = {
      issues: new SonarQubeIssues(client),
      metrics: new SonarQubeMetrics(client),
      components: new SonarQubeComponents(client)
    }
  }

  resolveBaseUrl = (baseUrl: string) => {
    if (baseUrl.endsWith('/api')) {
      return baseUrl;
    }
    return baseUrl + '/api';
  };

  get fetchers(){
    return {...this.pathClasses}
  }

}

export class SonarqubeSdk extends SonarqubeClient {
  constructor(options: AxiosRequestConfig) {
    super(axios.create(options));
  }
}
