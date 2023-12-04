import { describe, expect, it } from "vitest";

import { ErrorProxyStrategy, ProjectDataLoaderStrategy } from '.'
import { IProject } from "../../../../data/models/project";

class DummyStrategyWithError implements ProjectDataLoaderStrategy{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createWithBasicData(_data: Partial<IProject>[]): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}

class DummyStrategy implements ProjectDataLoaderStrategy{
  async createWithBasicData(data: Partial<IProject>[]): Promise<unknown> {
    return data
  }
}

const errorProxy  =  new ErrorProxyStrategy([
  {
    item: new DummyStrategyWithError(),
    continueOnError: true,
  },
  {
    item: new DummyStrategy()
  }
])

describe('Error Proxy Strategy', ()=>{
  it('Error Strategy Proxy', async ()=>{
    const dummyData: Partial<IProject>[] = [{
      name: 'fakeName'
    }]

    const response = await errorProxy.createWithBasicData(dummyData)

    expect(response).toStrictEqual(dummyData)
  })
})