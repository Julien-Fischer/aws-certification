import {ExpectedAnswer} from "./expected-answer";
import {Option} from "../option";
import {UserAnswer} from "../user-answer";

export class ExpectedChoice implements ExpectedAnswer<Option> {

  readonly #brand = Symbol();

  constructor(
    readonly value: Option,
    readonly explanation?: string
  ) { }

  accepts(userAnswer: UserAnswer): boolean {
    return this.value.prefix === userAnswer;
  }

  toString(): string {
    return String(this.value.toString());
  }

}
