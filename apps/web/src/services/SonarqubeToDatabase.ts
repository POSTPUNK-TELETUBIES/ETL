import { FetchMetricsAndProjects } from './Sonarqube';
import { type Project } from '../data/models/project';
import { inject, injectable } from 'inversify';
import { ContainerTags } from '../types';
import { parseProject } from '../utils';
import { groupBy, prop, mergeDeepRight } from 'ramda';

interface UpdateAcumulator {
  coverageMetrics: Record<string, unknown>;
  duplicationMetrics: Record<string, unknown>;
}

@injectable()
export class SonarqubeToDatabase {
  constructor(
    @inject(ContainerTags.ProxySonarClient)
    private sonarqubeService: FetchMetricsAndProjects,
    @inject(ContainerTags.Project) private databaseModel: typeof Project
  ) {}

  private reduceProjectKeys(hashtable: Record<string, boolean>, next: string) {
    hashtable[next] = true;
    return hashtable;
  }

  async migrateProjects() {
    const projectKeysFromDb = await this.getProjectKeysFromDb();

    const hashTableProjectKeys = projectKeysFromDb.reduce(
      this.reduceProjectKeys,
      {}
    );

    const projectsFromSonarqube = await this.sonarqubeService.getAllProjects();

    const newProjects = projectsFromSonarqube.filter(
      (project) => !hashTableProjectKeys[project.key]
    );

    const parsedProjects = newProjects.map(parseProject);

    return await this.databaseModel.insertMany(parsedProjects);
  }

  private async getProjectKeysFromDb() {
    const projectKeysFromDb = await this.databaseModel
      .find()
      .distinct('sonarKey');

    return projectKeysFromDb;
  }

  static coverageMetricsDict: Record<string, string> = {
    coverage: 'totalCoveragePercent',
    lines_to_cover: 'linesToCover',
    uncovered_lines: 'linesNoCover',
    line_coverage: 'linesCoveragePercent',
    conditions_to_cover: 'qtyConditionsToCover',
    uncovered_conditions: 'qtyConditionsNoCover',
    branch_coverage: 'conditionsCoveragePercentage',
  };

  static duplicateMetricsDict: Record<string, string> = {
    duplicated_lines: 'duplicatedLines',
    duplicated_blocks: 'duplicatedBlocks',
    duplicated_files: 'duplicatedFiles',
    duplicated_lines_density: 'totalDensityPercent',
  };

  async migrateMetrics() {
    const projectKeysFromDb = await this.getProjectKeysFromDb();

    for (let i = 0; i < projectKeysFromDb.length; i += 10) {
      const keysChunk = projectKeysFromDb.slice(i, i + 10);
      const metrics = await this.sonarqubeService.getMetricsByKeys(keysChunk);
      console.log({ metrics });
      const metricsByProjectKey = groupBy(prop('component'), metrics);

      const updateData = keysChunk.map((key) => {
        const update =
          metricsByProjectKey[key]?.reduce(
            (acum: UpdateAcumulator, { value, metric }) => {
              const coverageKey =
                SonarqubeToDatabase.coverageMetricsDict[metric];
              const duplicationKey =
                SonarqubeToDatabase.duplicateMetricsDict[metric];

              if (coverageKey)
                return mergeDeepRight(acum, {
                  coverageMetrics: { [coverageKey]: value },
                });

              if (duplicationKey) {
                return mergeDeepRight(acum, {
                  duplicationMetrics: { [duplicationKey]: value },
                });
              }
              return acum;
            },
            {
              coverageMetrics: {},
              duplicationMetrics: {},
            }
          ) ?? {};
        return {
          updateOne: {
            filter: { sonarKey: key },
            update,
          },
        };
      });

      this.databaseModel.bulkWrite(updateData);
    }
  }
}
