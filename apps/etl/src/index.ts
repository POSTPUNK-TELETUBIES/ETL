import 'reflect-metadata';
import { connect } from './services/Connection';
import { select } from '@inquirer/prompts';
import { Operations } from './types';
import { logger } from './global';
import { operationsByName } from './operations';

const getMainAnswerOperations = async () => {
  return await select({
    message: 'Seleccione una operacion:',
    choices: [
      {
        name: 'Migracion de proyectos',
        value: Operations.ProjectMigrations,
      },
      {
        name: 'Migracion de metricas',
        value: Operations.MetricsMigrations,
      },
      {
        name: 'Generar reportes de coverage',
        value: Operations.CoverageReports,
      },
      {
        name: 'Generar reportes de duplicacion',
        value: Operations.DuplicationReports,
      },
      {
        name: 'Migrar Issues',
        value: Operations.IssuesMigrations,
      },
      {
        name: 'Salir',
        value: Operations.Exit,
      },
    ],
  });
};

/**
 * @recursive
 */
const getAnswer = async () => {
  const operationName = await getMainAnswerOperations();

  try {
    await operationsByName[operationName]();
  } catch (error) {
    logger.error(error);
    console.log('Ocurrio un error');
  }
  await getAnswer();
};

const init = async () => {
  console.log('inicializando conexion');
  await connect();
  await getAnswer();
};

init();
