import { SonarqubeClient } from 'sonar-sdk'
import { ProjectTransformer } from '../../ProjectTransformer';
import { ProjectDataLoaderStrategy } from '../../ProjectDataLoader/Strategies';

export interface ProjectETLParticipants{
  dataSource: SonarqubeClient;
  dataLoader: ProjectDataLoaderStrategy;
  transformer: ProjectTransformer;
}

export interface ProjectPipelineMigrationStrategy{
  migrateBasicDataProjects():Promise<unknown>;
  migrateAllBasicDataProjects():Promise<unknown>;
}