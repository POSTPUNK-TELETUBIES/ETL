import { Component, Paging } from 'sonar-sdk';

export const parseProject = (project: Component) => ({
  sonarKey: project.key,
  name: project.name,
  analysisDate: project.analysisDate,
});

export const resolvePaging = ({ pageSize, total }: Paging) =>
  Math.ceil(total / pageSize);

export async function getLeftData<T = unknown>(
  leftPageCount: number, fetchDataCb: 
  (nextIndex: number)=>Promise<T[]>,
) {
  let result: T[] = [];
  for (let i = 0; i < leftPageCount; i++) {
    const fetchResult = await fetchDataCb(i +2) 

    result = result.concat(fetchResult);
  }
  return result;
}