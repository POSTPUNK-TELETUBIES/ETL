import { SonarqubeClient } from 'sonar-sdk'
import { ProjectDataLoader } from '../ProjectDataLoader';
import { ProjectTransformer } from '../ProjectTransformer';

export interface ProjectETLParticipants{
  dataSource: SonarqubeClient;
  dataLoader: ProjectDataLoader;
  transformer: ProjectTransformer;
}

export interface ProjectPipelineMigrationStrategy{
  migrateBasicDataProjects():Promise<unknown>
}