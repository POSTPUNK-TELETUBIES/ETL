import { EnvService } from '../services/EnvService';

export const config = new EnvService();

export const env = Object.freeze({
  apiBaseUrl: config.getOrThrow('API_BASE'),
  sonarToken: config.getOrThrow('SONAR_TOKEN'),
  uriMongo: config.getOrThrow('URI_MONGO'),
  generaLogsPath: config.getEnv('LOG_FOLDER', { defaultValue:'./logs/generalLogs.log'}),
  sonarQubeLogs: config.getEnv('SONARQUBE_LOGS', { defaultValue:'./logs/sonarqubeLogs.log'}),
});
