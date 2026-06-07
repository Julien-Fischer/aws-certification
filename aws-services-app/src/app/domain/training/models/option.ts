import {UserAnswer} from "./user-answer";

export class Option {

  public static from(value: string): Option {
    const parts = value.split(/\. */);
    const [prefix, label] = parts;
    return new Option(prefix, label);
  }

  readonly #brand = Symbol();

  constructor(
    readonly prefix: string,
    readonly label: string
  ) {
  }

  matches(answer: UserAnswer): boolean {
    return answer === this.prefix;
  }

  hasPrefix(prefix: string): boolean {
    return this.prefix === prefix;
  }

  toString(): string {
    return String(`${this.prefix}. ${this.label}`);
  }

}
