import { IProject } from "../../../../data/models/project";
import { NotImplementedError } from "../../../../errors/NotImplemented";
import { ProjectDataLoaderStrategy } from "./types";

export class ProjectDataLoaderUpsertStrategy implements ProjectDataLoaderStrategy{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createWithBasicData(_data: Partial<IProject>[]) {
    throw new NotImplementedError('createWithBasicData', this.constructor.name)
  }
}
