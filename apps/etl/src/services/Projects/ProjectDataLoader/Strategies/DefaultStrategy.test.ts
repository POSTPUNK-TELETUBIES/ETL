import { describe, expect, it, vi } from 'vitest'
import { ProjectDataLoaderDefaultStrategy } from '.'
import { IProject } from '../../../../data/models/project'

const strategy = new ProjectDataLoaderDefaultStrategy()

vi.mock('../../../../data/models/project', ()=>({
  Project: {
    distinct: ()=>['key1', 'key2'],
    insertMany: (projects: Partial<IProject>)=> projects
  }
}))

describe('Default Project Data Loader Strategy', ()=>{
  it('Create basic Data', async ()=>{
    const projects = await strategy.createWithBasicData([
      {
        sonarKey: 'key1'
      },
      {
        sonarKey: 'key3'
      }
    ])

    expect(projects).toStrictEqual([
      {
        sonarKey: 'key3'
      }]
    )
  })
})
