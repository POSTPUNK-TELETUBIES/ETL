export interface ResponseMetrics {
    measures: Metrics[];
  }
  
export interface Metrics {
  metric: string;
  value: string;
  component: string;
  bestValue?: boolean;
}
