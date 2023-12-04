import { IProject } from "../../../data/models/project";
import { ProjectDataLoaderStrategy } from "./Strategies";

export class ProjectDataLoader{
  constructor(private strategy: ProjectDataLoaderStrategy){}
  async createWithBasicData(data: Partial<IProject>[]){
    return await this.strategy.createWithBasicData(data);
  }
}