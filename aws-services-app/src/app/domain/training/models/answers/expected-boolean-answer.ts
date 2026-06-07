import {ExpectedAnswer} from "./expected-answer";
import {UserAnswer} from "../user-answer";

export class ExpectedBooleanAnswer implements ExpectedAnswer<boolean> {

  static ofTrue(explanation?: string): ExpectedBooleanAnswer {
    return ExpectedBooleanAnswer.of(true, explanation);
  }

  static ofFalse(explanation?: string): ExpectedBooleanAnswer {
    return ExpectedBooleanAnswer.of(false, explanation);
  }

  static of(value: boolean, explanation?: string): ExpectedBooleanAnswer {
    return new ExpectedBooleanAnswer(value, explanation);
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
