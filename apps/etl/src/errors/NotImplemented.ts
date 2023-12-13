export class NotImplementedError extends Error{
  constructor(
    methodName: string, 
    className: string,
    options?: ErrorOptions
  ){
    super(
      `Method ${methodName} in class ${className} is not implemented`,
      options
    )
  }
}