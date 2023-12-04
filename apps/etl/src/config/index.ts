import { EnvService } from '../services/EnvService';

export const config = new EnvService();

export const isNotTestingMode = process.env.NODE_ENV !== 'test'

export const env = Object.freeze({
  apiBaseUrl: config.getEnv('API_BASE', {
    isRequired: isNotTestingMode
  }),
  sonarToken: config.getEnv('SONAR_TOKEN', {
    isRequired: isNotTestingMode
  }),
  uriMongo: config.getEnv('URI_MONGO', {
    isRequired: isNotTestingMode
  }),
  generaLogsPath: config.getEnv('LOG_FOLDER', { defaultValue:'./logs/generalLogs.log'}),
  sonarQubeLogs: config.getEnv('SONARQUBE_LOGS', { defaultValue:'./logs/sonarqubeLogs.log'}),
});
