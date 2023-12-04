import { inject, injectable } from "inversify";
import { IssuePipelineMigrationStrategy } from ".";
import { BaseErrorIterator, ErrorHandlingItemConfig } from "../../../../errors";
import { NewContainerTags } from "../../../../types";

@injectable()
export class IssuePipelineMigrationStrategyProxy
extends BaseErrorIterator<IssuePipelineMigrationStrategy>
implements IssuePipelineMigrationStrategy
{
  constructor(
    @inject(NewContainerTags.ISSUES_PIPELINE_CONFIG) 
    config: ErrorHandlingItemConfig<IssuePipelineMigrationStrategy>[], 
    private _name = 'IssuePipeline'
  ){
    super(config)
  }
  async migrateByProjectKey(projectKey: string): Promise<unknown> {
    return await this.iterate(instance => instance.migrateByProjectKey(projectKey));
  }
  async migrateAll(): Promise<unknown> {
    return await this.iterate(instance => instance.migrateAll());
  }

  get name(){
    return this._name
  }
}
