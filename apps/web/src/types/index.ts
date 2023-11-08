export enum Operations {
  ProjectMigrations = 'PROJECT_MIGRATIONS',
  MetricsMigrations = 'METRICS_MIGRATIONS',
}

export enum ContainerTags {
  SonarClient = 'SONARCLIENT',
  Options = 'OPTIONS',
  Sonarqube = 'SONARQUBE',
  Project = 'PROJECT',
  SonarqubeMigrations = 'SONARQUBE_MIGRATIONS',
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
