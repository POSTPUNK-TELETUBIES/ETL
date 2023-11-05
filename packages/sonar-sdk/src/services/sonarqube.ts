import { AxiosInstance } from 'axios';
import { ResponseProjects } from '../types';

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

  async getProjects(pageNumber: number = 1, filter: string = '') {
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
}
