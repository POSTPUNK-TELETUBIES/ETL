/* eslint-disable @typescript-eslint/no-explicit-any */

import { NotImplementedError } from "./NotImplemented";

export type ContinueOnError<T> = boolean | ((error: any, instance?: T) => boolean);


export interface ErrorHandlingItemConfig<T>{
  item: T;
  continueOnError?: ContinueOnError<T>;
}


export type PredicateExecute<T> = (executor: T)=>Promise<unknown>;


export function resolveContinueOnError<T>(
  error: any, 
  instance: T,
  continueOnError?: ContinueOnError<T>,
){
  if(typeof continueOnError == 'function'){
    return continueOnError(error, instance)
  }

  return continueOnError
}


/**
 * A error handler that tries , in a series of classes that has the same interface,
 * a predicate and on error tries the next class in case method is not implemented
 * or a specific case.
 * 
 * @example 
 * class Saver extends BaseErrorIterator<SaverStrategy>{
 *   async save(data: any[]){
 *     return await this.iterate((currentSaverStrategy)=>saverStrategy.save(data));
 *   }
 * }
 * 
 * const saverStrategies = [
 *  {item: new SaveToDataBase(), continueOnError: true},
 *  {item: new SaveToCache()}
 * ]
 * const saver =  new Saver(saverStrategies)
 * 
 * saver.save([// many data])
 * 
 * @variation if save to data base fails, immediately saves to the cache to avoid losing data
 */
export abstract class BaseErrorIterator<T>{
  constructor(private items: ErrorHandlingItemConfig<T>[]){}

  async iterate(executeAlgorithmPredicate: PredicateExecute<T>){
    for(const {item, continueOnError} of this.items){
      try{
        return await executeAlgorithmPredicate(item);
      }catch(error){
        if(
          error instanceof NotImplementedError || 
          resolveContinueOnError<T>(error, item, continueOnError)
        ) continue;

        throw error;
      }
    }
  }
}