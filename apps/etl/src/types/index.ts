export enum Operations {
  ProjectMigrations = 'PROJECT_MIGRATIONS',
  MetricsMigrations = 'METRICS_MIGRATIONS',
  CoverageReports = 'COVERAGE_REPORTS',
  DuplicationReports = 'DUPLICATION_REPORTS',
  Exit = 'EXIT',
  IssuesMigrations = 'ISSUES_MIGRATIONS'
}

export enum ContainerTags {
  SonarClient = 'SONARCLIENT',
  Options = 'OPTIONS',
  Project = 'PROJECT',
  SonarqubeMigrations = 'SONARQUBE_MIGRATIONS',
  ProxySonarClient = 'PROXY_SONAR_CLIENT',
  SonarqubeLoggerOptions = 'SONARQUBE_LOGGER_OPTIONS',
}

export enum CoverageMetricKeys {
  Coverage = 'coverage',
  LinesCover = 'lines_to_cover',
  UncoverLines = 'uncovered_lines',
  LineCoverage = 'line_coverage',
  ConditionsCover = 'conditions_to_cover',
  UncoverConditions = 'uncovered_conditions',
  ConditionCoveragePercentage = 'branch_coverage',
}

export enum DuplicationMetricKeys {
  DuplicatedLines = 'duplicated_lines',
  DuplicatedBlocks = 'duplicated_blocks',
  DuplicatedFiles = 'duplicated_files',
  DuplicatedLinesDensity = 'duplicated_lines_density',
}


export const enum NewContainerTags{
  ISSUES_PIPELINE_STRATEGY = 'IssuesStrategy',
  ISSUES_PIPELINE_CONFIG = 'IssuesConfig',
  ISSUES_PIPELINE_PARTICIPANTS= 'IssuesParticipants',
  ISSUES_DATA_LOADER = 'IssuesDataLoader'
}
