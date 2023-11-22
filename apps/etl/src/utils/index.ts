import { Component, Paging } from 'sonar-sdk';

export const parseProject = (project: Component) => ({
  sonarKey: project.key,
  name: project.name,
  analysisDate: project.analysisDate,
});

export const resolvePaging = ({ pageSize, total }: Paging) =>
  Math.ceil(total / pageSize);
