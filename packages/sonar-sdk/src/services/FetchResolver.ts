export abstract class FetchResolver{
  constructor(private basePath:string){}

  protected resolvePath(path: string){
    return this.basePath + path;
  }
}