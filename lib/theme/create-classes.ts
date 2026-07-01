const classesPrefix = 'minimal';

export function createClasses(className: string): string {
  return `${classesPrefix}__${className}`;
}
