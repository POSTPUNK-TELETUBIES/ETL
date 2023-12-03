import { AxiosInstance } from "axios";
import { IssuesResponse, SearchIssuesParams } from "../types";
import { FetchResolver } from "./FetchResolver";
import { transformParams } from "../utils";

export class SonarQubeIssues extends FetchResolver{
  constructor(private client: AxiosInstance, basePath = '/issues'){
    super(basePath)
  }
  
  async search(params: SearchIssuesParams = {}){
    const { data } = await this.client.get<IssuesResponse>('/search', {
      params: transformParams<SearchIssuesParams>(params)
    });

    return data;
  }
}