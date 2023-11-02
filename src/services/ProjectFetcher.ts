import { AxiosInstance } from 'axios';

class ProjectFetcher {
  constructor(private clientAxios: AxiosInstance) {}

  async getMany() {
    const response = await this.clientAxios.get('/projects');
    return response.data;
  }
}
