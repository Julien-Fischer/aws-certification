import {ExpectedAnswer} from "./expected-answer";
import {UserAnswer} from "../user-answer";

export class BooleanAnswer implements ExpectedAnswer<boolean> {

  static readonly TRUE = new BooleanAnswer(true);
  static readonly FALSE = new BooleanAnswer(false);

  readonly #brand = Symbol();

  private constructor(readonly value: boolean) { }

  accepts(userAnswer: UserAnswer): boolean {
    return this.value === userAnswer;
  }

  toString(): string {
    return String(this.value.toString());
  }

  static from(value: boolean): BooleanAnswer {
    return value ? BooleanAnswer.TRUE : BooleanAnswer.FALSE;
  }

}
