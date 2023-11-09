"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const papaparse_1 = __importDefault(require("papaparse"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const headerEquivalence = {
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
const transformHeader = (header) => headerEquivalence[header];
//TODO: que pasaria si el string es muy largo , tengo q usar streams
//TODO: que pasa si el archivo esta en Google Drive o AWS S3 o Azure Blob Storage
(0, vitest_1.describe)('papaparse', () => {
    const dir = path_1.default.join(__dirname, 'test.csv');
    const stringConverted = fs_1.default.readFileSync(dir, 'utf-8');
    const result = papaparse_1.default.parse(stringConverted, {
        header: true,
        transformHeader,
    });
    (0, vitest_1.it)('shoulde be equal', () => {
        (0, vitest_1.expect)(result.data).toEqual(parsedExpected);
    });
    (0, vitest_1.it)('should not have errors', () => {
        (0, vitest_1.expect)(result.errors).toHaveLength(0);
    });
    (0, vitest_1.it)('should parse csv', () => {
        (0, vitest_1.expect)(result.meta.fields).toEqual(Object.keys(headerSchema));
    });
});
