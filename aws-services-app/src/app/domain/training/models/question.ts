import {Answer} from "./answer";

export abstract class Question {

  readonly #brand = Symbol();

  protected constructor(
    readonly label: string,
    readonly answer: Answer<any>
  ) { }

  hasAnswer(answer: Answer<any>): boolean {
    return this.answer.equals(answer);
  }

  abstract findExplanationFor(answer: Answer<any>): string | undefined;

}
