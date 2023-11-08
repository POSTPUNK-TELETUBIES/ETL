import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ResponseMetrics, ResponseProjects } from '../types';

export class SonarqubeClient {
  constructor(private client: AxiosInstance) {
    //TODO: violation open close principle
    if (!this.client.defaults.baseURL) throw new Error('baseURL is required');

    this.client.defaults.baseURL = this.resolveBaseUrl(
      this.client.defaults.baseURL
    );
  }

  resolveBaseUrl = (baseUrl: string) => {
    if (baseUrl.endsWith('/api')) {
      return baseUrl;
    }
    return baseUrl + '/api';
  };

  async searchProjects(pageNumber: number = 1, filter: string = '') {
    const { data } = await this.client.get<ResponseProjects>(
      '/components/search_projects',
      {
        params: {
          ps: 500,
          p: pageNumber,
          f: filter,
        },
      }
    );
    return data;
  }

  async searchMetrics(projectKeys: string[], metricKeys: string[]) {
    const { data } = await this.client.get<ResponseMetrics>(
      '/measures/search',
      {
        params: {
          projectKeys: projectKeys.join(','),
          metricKeys: metricKeys.join(','),
        },
      }
    );
    console.log({ data });
    return data;
  }
}

export class SonarqubeSdk extends SonarqubeClient {
  constructor(options: AxiosRequestConfig) {
    super(axios.create(options));
  }
}
