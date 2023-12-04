import { IssuePipelineMigrationStrategy } from ".";
import { BaseErrorIterator } from "../../../../errors";

export class IssuePipelineMigrationStrategyProxy
extends BaseErrorIterator<IssuePipelineMigrationStrategy>
implements IssuePipelineMigrationStrategy
{
  async migrateByProjectKey(projectKey: string): Promise<unknown> {
    return await this.iterate(instance => instance.migrateByProjectKey(projectKey));
  }
  async migrateAll(): Promise<unknown> {
    return await this.iterate(instance => instance.migrateAll());
  }

}
