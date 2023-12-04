import { BaseErrorIterator } from "../../../../errors/BaseErrorIterator";
import { ProjectPipelineMigrationStrategy } from "../types";

export class ProjectPipelineMigrationStrategyProxy
extends BaseErrorIterator<ProjectPipelineMigrationStrategy>
implements ProjectPipelineMigrationStrategy
{
  async migrateBasicDataProjects(): Promise<unknown> {
    return await this.iterate((strategy)=>strategy.migrateBasicDataProjects());
  }
}
