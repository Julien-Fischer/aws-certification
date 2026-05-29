import {Answer} from "./answer";
import {Question} from "./question";

export class BooleanQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: Answer<boolean>,
    readonly explanation?: string
  ) {
    super(label, answer);
  }

  findExplanationFor(answer: Answer<any>): string | undefined {
    return this.explanation;
  }

}
