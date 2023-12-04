import { ProjectETLParticipants, ProjectPipelineMigrationStrategy } from "../types";

export class ProjectPipelineMigrationDefaultStrategy implements ProjectPipelineMigrationStrategy{
    constructor(
      private participants: ProjectETLParticipants
    ){}
  
    /**
     * @todo search projects method should admit more params for filtering
     */
    async migrateBasicDataProjects(){
      const { components } = await this
        .participants
        .dataSource
        .fetchers
        .components
        .searchProjects(1)
      
      const transformedData = this
        .participants
        .transformer
        .resolveComponentsToProjects(components)
      
      return await this
        .participants
        .dataLoader
        .createWithBasicData(transformedData)
    }
  }