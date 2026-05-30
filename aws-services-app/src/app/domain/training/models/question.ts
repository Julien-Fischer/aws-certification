import {ExpectedAnswer} from "./expected-answer";
import {UserAnswer} from "./user-answer";

export abstract class Question {

  readonly #brand = Symbol();

  protected constructor(
    readonly label: string,
    readonly answer: ExpectedAnswer<any>
  ) { }

  hasAnswer(answer: UserAnswer): boolean {
    return this.answer.accepts(answer);
  }

  abstract findExplanationFor(answer: UserAnswer): string | undefined;

}
