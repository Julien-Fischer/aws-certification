import {Question} from "./question";
import {ExpectedBoolean} from "../answers/expected-boolean";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedBoolean,
  ) {
    super(label, answer);
  }

}
