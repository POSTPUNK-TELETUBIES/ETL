import { Logger } from 'pino';
import { Component } from 'sonar-sdk';
import { loggerForFunctions } from '../global';

export const parseProject = (project: Component) => ({
  sonarKey: project.key,
  name: project.name,
  analysisDate: project.analysisDate,
});

export const timeCalcDefaultCallback = (initTime: number) =>
  `Duracion: ${(Date.now() - initTime) / 1000} segundos`

export async function executeWithTimeLogger<T = unknown>(
  callback: () => Promise<T>,
  logger: Logger = loggerForFunctions,
  timeCalcCallback = timeCalcDefaultCallback
) {
  const initTime = Date.now()

  await callback()

  logger.info(timeCalcCallback(initTime))
}