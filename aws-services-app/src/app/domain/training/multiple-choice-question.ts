import {Answer} from "./answer";
import {Question} from "./question";

export class MultipleChoiceQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: Answer<Option>,
    readonly options: Option[]
  ) {
    super(label, answer);
  }
}

export class Option {

  public static from(value: string): Option {
    const parts = value.split(/\. */);
    const [prefix, label] = parts;
    return new Option(prefix, label);
  }

  readonly #brand = Symbol();

  constructor(
    readonly prefix: string,
    readonly label: string,
  ) {
  }

  hasPrefix(prefix: string): boolean {
    return this.prefix === prefix;
  }

  toString(): string {
    return String(`${this.prefix}. ${this.label}`);
  }

}
