import { Component } from "sonar-sdk";
import { IProject } from "../../../data/models/project";

export class ProjectTransformer{
  resolveComponentToProject(data: Component): Partial<IProject>{
    return {
      name: data.name,
      sonarKey: data.key,
      analysisDate: data.analysisDate,
    }
  }

  resolveComponentsToProjects(data: Component[]): Partial<IProject>[]{
    return data.map((component)=> this.resolveComponentToProject(component))
  }
}