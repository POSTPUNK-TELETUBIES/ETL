import { Component } from 'sonar-sdk';

export const parsedProject = (project: Component) => ({
  sonarKey: project.key,
  name: project.name,
  analysisDate: project.analysisDate,
});
