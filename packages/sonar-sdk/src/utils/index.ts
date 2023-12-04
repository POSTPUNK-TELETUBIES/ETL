type SimpleMap = Record<string, string | number | undefined> 

export function transformParams<T extends object = object>(params: T){
  const result: SimpleMap= {};

  for (const key in params) {
    const element = params[key as keyof T ];
    result[key] = Array.isArray(element) ? element.join(',') : element as string;
  }

  return result;
}