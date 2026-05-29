export class Answer<T extends {toString: () => string}> {

  readonly #brand = Symbol();

  constructor(
    readonly value: T,
    readonly explanation?: string
  ) { }

  isExplained(): boolean {
    return this.explanation != null;
  }

  equals(other: Answer<T>): boolean {
    return this.value.toString() === other.value.toString();
  }

  toString(): string {
    return String(this.value.toString());
  }

}
