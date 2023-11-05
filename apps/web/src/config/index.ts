import { EnvService } from '../services/EnvService';

interface IEnvironments {
  apiBaseUrl: string;
  sonarToken: string;
  uriMongo: string;
}

export const config = new EnvService();

export const env: IEnvironments = {
  apiBaseUrl: config.getOrThrow('API_BASE', { isRequired: true }),
  sonarToken: config.getOrThrow('SONAR_TOKEN', { isRequired: true }),
  uriMongo: config.getOrThrow('URI_MONGO', { isRequired: true }),
};
