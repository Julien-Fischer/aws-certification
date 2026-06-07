import {ExpectedAnswer} from "./expected-answer";
import {UserAnswer} from "../user-answer";

export class BooleanAnswer implements ExpectedAnswer<boolean> {

  static ofTrue(explanation?: string): BooleanAnswer {
    return BooleanAnswer.of(true, explanation);
  }

  static ofFalse(explanation?: string): BooleanAnswer {
    return BooleanAnswer.of(false, explanation);
  }

  static of(value: boolean, explanation?: string): BooleanAnswer {
    return new BooleanAnswer(value, explanation);
  }

  readonly #brand = Symbol();

  private constructor(
    readonly value: boolean,
    readonly explanation?: string
  ) { }

  accepts(userAnswer: UserAnswer): boolean {
    return this.value === userAnswer;
  }

  toString(): string {
    return String(this.value.toString());
  }

}
