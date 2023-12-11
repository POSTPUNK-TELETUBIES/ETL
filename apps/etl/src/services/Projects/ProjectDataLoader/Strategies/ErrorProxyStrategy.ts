
import { IProject } from "../../../../data/models/project";
import { BaseErrorIterator } from "../../../../errors/BaseErrorIterator";
import { ProjectDataLoaderStrategy } from "./types";


export class ErrorProxyStrategy 
  extends BaseErrorIterator<ProjectDataLoaderStrategy> 
  implements ProjectDataLoaderStrategy 
{
  async createWithBasicData(data: Partial<IProject>[]) {
    return await this.iterate((strategy)=> strategy.createWithBasicData(data))
  }
}