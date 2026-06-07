import {Question} from "./question";
import {ExpectedAnswer} from "../answers/expected-answer";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedAnswer<boolean>
  ) {
    super(label, answer);
  }

}
