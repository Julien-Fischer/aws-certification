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

  findExplanationFor(answer: Answer<any>): string | undefined {
    return this.options
      .find((option) => option.matches(answer))
      ?.explanation;
  }

}

export class Option {

  public static from(value: string, explanation?: string): Option {
    const parts = value.split(/\. */);
    const [prefix, label] = parts;
    return new Option(prefix, label, explanation);
  }

  readonly #brand = Symbol();

  constructor(
    readonly prefix: string,
    readonly label: string,
    readonly explanation?: string
  ) {
  }

  matches(answer: Answer<Option>): boolean {
    return answer.value.hasPrefix(this.prefix);
  }

  hasPrefix(prefix: string): boolean {
    return this.prefix === prefix;
  }

  toString(): string {
    return String(`${this.prefix}. ${this.label}`);
  }

}
