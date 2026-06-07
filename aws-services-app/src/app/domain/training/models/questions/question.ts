import {UserAnswer} from "../user-answer";
import {ExpectedAnswer} from "../answers/expected-answer";

export abstract class Question {

  readonly #brand = Symbol();

  protected constructor(
    readonly label: string,
    readonly answer: ExpectedAnswer<any>
  ) { }

  hasAnswer(answer: UserAnswer): boolean {
    return this.answer.accepts(answer);
  }

  get explanation(): string | undefined {
    return this.answer.explanation;
  };

}
