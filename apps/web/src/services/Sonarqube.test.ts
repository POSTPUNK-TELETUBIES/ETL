import 'reflect-metadata';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { SonarqubeService } from './Sonarqube';
import { SonarqubeSdk } from 'sonar-sdk';
import { faker } from '@faker-js/faker';

const total = faker.number.int({ min: 10, max: 20 });
const pageSize = 5;

const getPaging = (page: number) => ({
  pageIndex: page,
  pageSize,
  total,
});

const createComponent = () => ({
  key: faker.lorem.word(),
  name: faker.lorem.word(),
  analysisDate: faker.date.past().toISOString(),
});

const totalComponentes = Array.from({ length: total }).map(createComponent);

const getProjects = vi.fn((page: number) => ({
  paging: getPaging(page),
  components: totalComponentes.slice((page - 1) * pageSize, page * pageSize),
}));

vi.mock('sonar-sdk', () => {
  return {
    SonarqubeSdk: vi.fn(() => {
      return {
        getProjects,
      };
    }),
  };
});

afterAll(() => {
  vi.resetAllMocks();
});

describe('Sonarqube service', async () => {
  const sonarQubeClient = new SonarqubeSdk({
    baseURL: faker.internet.url(),
  });
  const sonarqubeService = new SonarqubeService(sonarQubeClient);
  const response = await sonarqubeService.getAllProjects();

  it('project should be equal components', async () => {
    expect(response).toEqual(totalComponentes);
  });

  it('should return a list of projects', async () => {
    expect(response.length).toBe(total);
  });
});
