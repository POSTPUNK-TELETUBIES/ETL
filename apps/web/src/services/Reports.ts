import { IProject, Project } from '../data/models/project';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { inject, injectable } from 'inversify';
import { unparse } from 'papaparse';
import { ContainerTags } from '../types';
import { FilterQuery } from 'mongoose';

dayjs.extend(utc);
dayjs.extend(timezone);

interface ProjectWithCoverage {
  sonarKey: string;
  name: string;
  totalCoveragePercent: number;
  linesToCover: number;
  linesNoCover: number;
  linesCoveragePercent: number;
  qtyConditionsToCover: number;
  qtyConditionsNoCover: number;
  conditionsCoveragePercentage: number;
  dayUpdated: string;
  timeUpdated: string;
}

interface ProjectWithDuplication {
  sonarKey: string;
  name: string;
  totalDensityPercent: number;
  duplicatedLines: number;
  duplicatedBlocks: number;
  duplicatedFiles: number;
  dayUpdated: string;
  timeUpdated: string;
}

@injectable()
export class Reports {
  constructor(
    @inject(ContainerTags.Project) private projectModel: typeof Project
  ) {}

  private serializeProjectWithCoverage(project: Partial<ProjectWithCoverage>) {
    return {
      'PROJECT KEY': project.sonarKey,
      'PROJECT NAME': project.name,
      '% COVER': project.totalCoveragePercent,
      'LINES TO COV': project.linesToCover,
      'LINES W/COV': project.linesNoCover,
      '% LINE COVER': project.linesCoveragePercent,
      'COND TO COV': project.qtyConditionsToCover,
      'COND W/COV': project.qtyConditionsNoCover,
      '% COND COV': project.conditionsCoveragePercentage,
      'D. MIGRA BD': project.dayUpdated,
      'H. MIGRA BD': project.timeUpdated,
    };
  }

  private serializeProjectByDuplication(
    projectDuplicated: Partial<ProjectWithDuplication>
  ) {
    return {
      'PROJECT KEY': projectDuplicated.sonarKey,
      'PROJECT NAME': projectDuplicated.name,
      '% DUPLIC': projectDuplicated.totalDensityPercent,
      'LINE DUPLIC': projectDuplicated.duplicatedLines,
      'BLOCK DUPLIC': projectDuplicated.duplicatedBlocks,
      'FILE DUPLIC': projectDuplicated.duplicatedFiles,
      'D. MIGRA BD': projectDuplicated.dayUpdated,
      'H. MIGRA BD': projectDuplicated.timeUpdated,
    };
  }

  private parseProjects(projects: IProject[]) {
    return projects.map(({ coverageMetrics, updatedAt, ...rest }) => ({
      ...coverageMetrics,
      ...rest,
      dayUpdated: dayjs(updatedAt).tz('America/Lima').format('DD/MM/YYYY'),
      timeUpdated: dayjs(updatedAt).tz('America/Lima').format('HH:mm:ss'),
      observation: 'Cobertura',
    }));
  }

  private parseDuplicationByProjects(projects: IProject[]) {
    return projects.map(({ duplicationMetrics, updatedAt, ...rest }) => ({
      ...duplicationMetrics,
      ...rest,
      dayUpdated: dayjs(updatedAt).tz('America/Lima').format('DD/MM/YYYY'),
      timeUpdated: dayjs(updatedAt).tz('America/Lima').format('HH:mm:ss'),
      observation: 'Duplicación',
    }));
  }

  async getCoverageMetrics(filterQuery: FilterQuery<IProject> = {}) {
    const projects = await this.projectModel
      .find(filterQuery)
      .select({
        sonarKey: true,
        name: true,
        coverageMetrics: true,
        updatedAt: true,
        createdAt: true,
      })
      .lean();

    const parsedProjects = this.parseProjects(projects as IProject[]).map(
      this.serializeProjectWithCoverage
    );

    const csvProjects = unparse(parsedProjects);
    return csvProjects;
  }

  async getDuplicationMetrics(filterQuery: FilterQuery<IProject> = {}) {
    const projects = await this.projectModel
      .find(filterQuery)
      .select({
        sonarKey: true,
        name: true,
        duplicationMetrics: true,
        updatedAt: true,
        createdAt: true,
      })
      .lean();

    const parsedDuplicationByProjects = this.parseDuplicationByProjects(
      projects as IProject[]
    ).map(this.serializeProjectByDuplication);

    const csvProjectByDuplication = unparse(parsedDuplicationByProjects);
    return csvProjectByDuplication;
  }
}
