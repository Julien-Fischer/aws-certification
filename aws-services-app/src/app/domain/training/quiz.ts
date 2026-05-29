import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "../scoring/models/percentage";

export class Quiz {

  readonly #brand = Symbol();

  constructor(
    readonly questions: Question[]
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
  }

  length(): number {
    return this.questions.length;
  }

}
