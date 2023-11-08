export interface ResponseProjects {
  paging: Paging;
  components: Component[];
  facets: any[];
}

export interface Component {
  key: string;
  name: string;
  qualifier: Qualifier;
  isFavorite: boolean;
  tags: any[];
  visibility: Visibility;
  needIssueSync: boolean;
  analysisDate: Date;
}

export enum Qualifier {
  Trk = 'TRK',
}

export enum Visibility {
  Public = 'public',
}

export interface Paging {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface ResponseMetrics {
  measures: Metrics[];
}

export interface Metrics {
  metric: string;
  value: string;
  component: string;
  bestValue?: boolean;
}
