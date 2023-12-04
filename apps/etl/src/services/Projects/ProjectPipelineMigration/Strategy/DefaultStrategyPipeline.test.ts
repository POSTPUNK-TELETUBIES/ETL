import 'reflect-metadata'
import { afterAll, describe, expect, it, vi } from "vitest";
import { ProjectPipelineMigrationDefaultStrategy } from '.'
import { ProjectDataLoaderStrategy } from "../../ProjectDataLoader/Strategies";
import { IProject } from "../../../../data/models/project";
import { ProjectTransformer } from "../../ProjectTransformer";
import { Component, ResponseProjects, SonarqubeSdk } from "sonar-sdk";

class DummyStrategy implements ProjectDataLoaderStrategy{
  async createWithBasicData(data: Partial<IProject>[]){
    return data;
  }
}

const dataSource = new SonarqubeSdk({
  baseURL: 'https://fakeurl.com'
})

const dummyPagination = {
  pageIndex: 0,
  pageSize: 0,
  total: 0
}

const dummyComponents: Component[] = [];

const dummyData: ResponseProjects = {
  components: dummyComponents,
  facets: [],
  paging: dummyPagination
};

vi.spyOn(dataSource.fetchers.components, 'searchProjects')
  .mockImplementation(()=>Promise.resolve(dummyData))

afterAll(()=>{
  vi.clearAllMocks()
})

const strategy = new ProjectPipelineMigrationDefaultStrategy({
  dataLoader: new DummyStrategy(),
  transformer: new ProjectTransformer(),
  dataSource
});

describe.concurrent('Default Strategy', ()=>{
  it('Migrate basic data projects', async ()=>{
    const data = await strategy.migrateBasicDataProjects()

    expect(dummyData).toMatchObject(data)
  })

  it('Migrate all basic data projects', async ()=>{
    const data = await strategy.migrateAllBasicDataProjects()

    expect(data).toStrictEqual(dummyComponents)
  })
})