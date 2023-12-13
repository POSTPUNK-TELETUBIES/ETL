import { IProject } from "../../../../data/models/project";

export interface ProjectDataLoaderStrategy{
  createWithBasicData(data: Partial<IProject>[]): Promise<unknown>
}
