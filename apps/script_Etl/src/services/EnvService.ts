import 'dotenv/config';

export interface GetEnvOptions {
  isRequired?: boolean;
}


export class RequiredEnvError extends Error {
  constructor(envName: string) {
    super(`
      Env variable ${envName} is required to start project,
      check your .env file
    `);
  }
}

export class EnvService {
  private mergeOptions(options: GetEnvOptions) {
    return {
      ...options,
    };
  }

  getEnv(envName: string, options: GetEnvOptions = {}) {
    const { isRequired } = this.mergeOptions(options);

    const value = process.env[envName];

    if (isRequired && !value) throw new RequiredEnvError(envName);

    return value;
  }

  getOrThrow(envName: string, options: GetEnvOptions = {}): string {
    return this.getEnv(envName, { ...options, isRequired: true }) as string;
  }
}
