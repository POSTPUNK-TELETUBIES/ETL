import axios from 'axios';
import { Component, Paging, SonarqubeClient } from 'sonar-sdk';
import { env } from '../config';

const { apiBaseUrl, sonarToken } = env;

const sonarQubeAxiosClient = axios.create({
  baseURL: apiBaseUrl,
  auth: {
    username: sonarToken,
    password: '',
  },
});

const sonarClient = new SonarqubeClient(sonarQubeAxiosClient);

const resolvePaging = ({ pageSize, total }: Paging) =>
  Math.ceil(total / pageSize);

export const getAllProjects = async () => {
  let result: Component[] = [];
  const { paging, components } = await sonarClient.getProjects(
    1,
    'analysisDate'
  );
  const leftPageCount = resolvePaging(paging) - 1;

  for (let i = 0; i < leftPageCount; i++) {
    const { components } = await sonarClient.getProjects(i + 2, 'analysisDate');
    result = result.concat(components);
  }
  console.log(result.concat(components));
  return result.concat(components);
};
