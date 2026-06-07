import {Question} from "./question";
import {ExpectedBooleanAnswer} from "../answers/expected-boolean-answer";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedBooleanAnswer,
  ) {
    super(label, answer);
  }

}
