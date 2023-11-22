import { describe, expect, it } from 'vitest';
import papaparse from 'papaparse';
import path from 'path';
import fs from 'fs';

const headerEquivalence: Record<string, string> = {
  'nombre del proyecto': 'projectName',
  'Key del proyecto': 'projectSonarKey',
};

const headerSchema = {
  projectName: 'string',
  projectSonarKey: 'string',
};

const parsedExpected = [
  {
    projectName: 'fe-ecommerce',
    projectSonarKey: 'Fe-ecommerce',
  },
  {
    projectName: 'fe-ecommerce-vida',
    projectSonarKey: 'Fe-ecommerce-vida',
  },
];

const transformHeader = (header: string) => headerEquivalence[header];

//TODO: que pasaria si el string es muy largo , tengo q usar streams
//TODO: que pasa si el archivo esta en Google Drive o AWS S3 o Azure Blob Storage
describe('papaparse', () => {
  const dir = path.join(__dirname, 'test.csv');
  const stringConverted = fs.readFileSync(dir, 'utf-8');
  const result = papaparse.parse(stringConverted, {
    header: true,
    transformHeader,
  });

  it('shoulde be equal', () => {
    expect(result.data).toEqual(parsedExpected);
  });

  it('should not have errors', () => {
    expect(result.errors).toHaveLength(0);
  });

  it('should parse csv', () => {
    expect(result.meta.fields).toEqual(Object.keys(headerSchema));
  });
});
