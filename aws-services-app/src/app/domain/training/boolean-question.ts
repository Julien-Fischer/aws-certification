import {Answer} from "./answer";
import {Question} from "./question";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: Answer<boolean>
  ) {
    super(label, answer);
  }
}
