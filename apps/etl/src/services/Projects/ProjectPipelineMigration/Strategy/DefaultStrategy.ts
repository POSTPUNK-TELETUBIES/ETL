import { resolvePaging } from "../../../../utils";
import { ProjectETLParticipants, ProjectPipelineMigrationStrategy } from "./types";

export class ProjectPipelineMigrationDefaultStrategy implements ProjectPipelineMigrationStrategy{
    constructor(
      private participants: ProjectETLParticipants
    ){}
  
    /**
     * @todo search projects method should admit more params for filtering
     */
    async migrateBasicDataProjects(pageNumber = 1){
      const { components, paging } = await this
        .participants
        .dataSource
        .fetchers
        .components
        .searchProjects(pageNumber)
      
      const transformedData = this
        .participants
        .transformer
        .resolveComponentsToProjects(components)
      
      await this
        .participants
        .dataLoader
        .createWithBasicData(transformedData)

      return paging;
    }

    async migrateAllBasicDataProjects(){
      const paging = await this.migrateBasicDataProjects();

      const totalPages = resolvePaging(paging)

      for (let page = 2; page <= totalPages; page++) {
        await this.migrateBasicDataProjects(page);
      }
    }
  }