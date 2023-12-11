import { AxiosInstance } from "axios";
import { ResponseProjects } from "../types";
import { FetchResolver } from "./FetchResolver";

export class SonarQubeComponents extends FetchResolver{
  constructor(private client: AxiosInstance, basePath ='/components'){
    super(basePath);
  };

  //TODO: search method needs more params to filter and so on
  async searchProjects(pageNumber: number = 1, filter = '') {
    const { data } = await this.client.get<ResponseProjects>(
      this.resolvePath('/search_projects'),
      {
        params: {
          ps: 500,
          p: pageNumber,
          f: filter,
        },
      }
    );
    return data;
  }
}
