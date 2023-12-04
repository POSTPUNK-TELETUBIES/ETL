import { IProject, Project } from "../../../../data/models/project";
import { ProjectDataLoaderStrategy } from "./types";

export class ProjectDataLoaderDefaultStrategy implements ProjectDataLoaderStrategy{
  async createWithBasicData(data: Partial<IProject>[]) {
    const alreadyInDataBaseProjects = await Project.distinct('sonarKey');

    const alreadyInDataBaseProjectsSet = new Set(alreadyInDataBaseProjects)

    const notInDatabaseProjects = data
      .filter(({ sonarKey })=> sonarKey && !alreadyInDataBaseProjectsSet.has(sonarKey))

    return await Project.insertMany(notInDatabaseProjects)
  }
}