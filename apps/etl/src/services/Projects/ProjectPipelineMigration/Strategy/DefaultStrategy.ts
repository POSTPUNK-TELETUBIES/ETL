import { resolvePaging } from "../../../../utils/fetch";
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

      return {components, paging};
    }

    async migrateAllBasicDataProjects(){
      const {components: firstComponents, paging} = await this
        .migrateBasicDataProjects();

      const result = firstComponents
      const totalPages = resolvePaging(paging)

      for (let page = 2; page <= totalPages; page++) {
        const {components} = await this.migrateBasicDataProjects(page);
        result.push(...components)
      }

      return result;
    }
  }