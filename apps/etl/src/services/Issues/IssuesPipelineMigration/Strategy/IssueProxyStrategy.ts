import { inject, injectable } from "inversify";
import { IssuePipelineMigrationStrategy } from ".";
import { BaseErrorIterator, ErrorHandlingItemConfig } from "../../../../errors";
import { NewContainerTags } from "../../../../types";

/**
 * This class is a proxy to handle errors in the issues pipeline
 * @todo create a better name for this class
 * in case you dont now what is a proxy you should see
 * @link https://refactoring.guru/es/design-patterns/proxy
 */
@injectable()
export class IssueMigrationProxyErrorsStrategy
  extends BaseErrorIterator<IssuePipelineMigrationStrategy>
  implements IssuePipelineMigrationStrategy {
  constructor(
    @inject(NewContainerTags.ISSUES_PIPELINE_CONFIG)
    config: ErrorHandlingItemConfig<IssuePipelineMigrationStrategy>[],
    private _name = 'IssuePipeline'
  ) {
    super(config)
  }
  async migrateByProjectKey(projectKey: string): Promise<unknown> {
    return await this.iterate(instance => instance.migrateByProjectKey(projectKey));
  }
  async migrateAll(): Promise<unknown> {
    return await this.iterate(instance => instance.migrateAll());
  }

  get name() {
    return this._name
  }
}
