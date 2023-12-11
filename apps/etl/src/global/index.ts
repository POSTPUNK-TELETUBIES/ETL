import pino, { destination } from "pino";
import { env } from "../config";

export const logger = pino(destination({ dest: `${env.generaLogsPath}`, sync: true }));

export const loggerForFunctions = pino()