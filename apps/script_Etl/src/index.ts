import { connect } from './services/Connection';
import { Project } from './data/models/project';
import { select } from '@inquirer/prompts';
import { getAllProjects } from './services/Sonarqube';
import { Operations } from './types';
import { parsedProject } from './utils';

const init = async () => {
  console.log('inicializando conexion');
  await connect();
  const answer = await select({
    message: 'Seleccione una operacion:',
    choices: [
      {
        name: 'Migracion de proyectos',
        value: Operations.ProjectMigrations,
      },
    ],
  });

  if (answer === Operations.ProjectMigrations) {
    try {
      const projects = await getAllProjects();
      const parsedProjects = projects.map(parsedProject);
      await Project.insertMany(parsedProjects);
      console.log('Migracion completada con exito!');
    } catch (_error) {
      console.log(_error);
      console.log('Ups Algo salio mal!');
    }
    process.exit(0);
  }
};

init();
