import { describe, expect, it, vi } from "vitest";
import { ProjectPipelineMigrationDefaultStrategy } from '.'
import { ProjectDataLoader } from "../../ProjectDataLoader";
import { ProjectDataLoaderStrategy } from "../../ProjectDataLoader/Strategies";
import { IProject } from "../../../../data/models/project";
import { ProjectTransformer } from "../../ProjectTransformer";
import { ResponseProjects, SonarqubeSdk } from "sonar-sdk";

class DummyStrategy implements ProjectDataLoaderStrategy{
  async createWithBasicData(data: Partial<IProject>[]){
    return data;
  }
}

const dataLoader = new ProjectDataLoader(new DummyStrategy())

const dataSource = new SonarqubeSdk({
  baseURL: 'https://fakeurl.com'
})

const dummyData: ResponseProjects = {
  components: [],
  facets: [],
  paging: {
    pageIndex: 0,
    pageSize: 0,
    total: 0
  }
};

vi.spyOn(dataSource.fetchers.components, 'searchProjects')
  .mockImplementationOnce(()=>Promise.resolve(dummyData))

const strategy = new ProjectPipelineMigrationDefaultStrategy({
  dataLoader,
  transformer: new ProjectTransformer(),
  dataSource
});

describe('Default Strategy', ()=>{
  it('Migrate basic data projects', async ()=>{
    const data = await strategy.migrateBasicDataProjects()

    expect(data).toStrictEqual([])
  })
})