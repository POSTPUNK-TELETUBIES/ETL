import { describe, expect, it, vi } from 'vitest';
import { SonarQubeIssues } from './SonarQubeIssues';
import axios from 'axios';
import { IssuesResponse } from '../types';

const axiosClient = axios.create({
  baseURL: 'https://fakeBaseUrl.com',
  auth: {
    password: 'fakePassword',
    username:'fakeUsername'
  }
})

const dummyData: IssuesResponse = {
  components:[],
  issues: [],
  paging: {
    pageIndex:0,
    pageSize: 0,
    total: 0
  },
  rules:[],
  users: [],
}

vi.spyOn(axiosClient, 'get').mockImplementation(()=>Promise.resolve({
  data: dummyData,
}))

describe('Sonar qube issues', ()=>{
  const service = new SonarQubeIssues(axiosClient)
  it('search issues', async ()=>{
    const data = await service.search();
    console.log(data);

    expect(data).toEqual(data)
  })
})