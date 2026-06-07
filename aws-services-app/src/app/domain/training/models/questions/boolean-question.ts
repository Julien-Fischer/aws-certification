import {Question} from "./question";
import {UserAnswer} from "../user-answer";
import {ExpectedAnswer} from "../answers/expected-answer";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedAnswer<boolean>,
    readonly explanation?: string
  ) {
    super(label, answer);
  }

  findExplanationFor(answer: UserAnswer): string | undefined {
    return this.explanation;
  }

}
