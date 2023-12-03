import { AxiosInstance } from "axios";
import { ResponseMetrics } from "../types";
import { FetchResolver } from "./FetchResolver";

export class SonarQubeMetrics extends FetchResolver{
  constructor(private client: AxiosInstance, basePath = '/measures'){
    super(basePath)
  };

  //TODO: search method needs more params to filter and so on
  async search(projectKeys: string[], metricKeys: string[]) {
    const { data } = await this.client.get<ResponseMetrics>(
      this.resolvePath('/search'),
      {
        params: {
          projectKeys: projectKeys.join(','),
          metricKeys: metricKeys.join(','),
        },
      }
    );
    return data;
  }
}
