import { ProjectPipelineMigrationStrategy } from "./types";

export class ProjectPipelineMigration{
  constructor(private strategy: ProjectPipelineMigrationStrategy){}
  async migrateBasicDataProjects(){
    return await this.strategy.migrateBasicDataProjects();
  }
}

