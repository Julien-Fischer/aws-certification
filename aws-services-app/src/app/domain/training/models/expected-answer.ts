import {UserAnswer} from "./user-answer";
import {Option} from "./multiple-choice-question";

export class ExpectedAnswer<T extends {toString: () => string}> {

  readonly #brand = Symbol();

  constructor(readonly value: T) { }

  accepts(userAnswer: UserAnswer): boolean {
    return this.value instanceof Option
      ? this.value.prefix === userAnswer
      : this.value === userAnswer;
  }

  toString(): string {
    return String(this.value.toString());
  }

}
