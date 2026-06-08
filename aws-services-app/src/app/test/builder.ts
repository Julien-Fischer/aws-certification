export interface Builder<T> {
  build(): T;
}

export function buildAll<T>(builders: Builder<T>[]): T[] {
  return builders.map(builder => builder.build());
}
