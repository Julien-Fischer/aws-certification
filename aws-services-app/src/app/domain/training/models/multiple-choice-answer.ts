import {UserAnswer} from "./user-answer";
import {Option} from "./multiple-choice-question";
import {ExpectedAnswer} from "./expected-answer";

export class MultipleChoiceAnswer implements ExpectedAnswer<Option> {

  readonly #brand = Symbol();

  constructor(readonly value: Option) { }

  accepts(userAnswer: UserAnswer): boolean {
    return this.value.prefix === userAnswer;
  }

  toString(): string {
    return String(this.value.toString());
  }

}
