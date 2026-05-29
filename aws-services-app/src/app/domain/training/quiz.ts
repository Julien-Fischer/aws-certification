import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "../scoring/models/percentage";

export class Result {

  readonly #brand = Symbol();

  constructor(
    readonly isCorrect: boolean,
  ) { }

}

export class Quiz {

  readonly #brand = Symbol();

  private currentQuestion = this.questions[0];

  constructor(
    readonly questions: Question[]
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
  }

  submit(answer: Answer<any>): Result {
    return new Result(this.isCorrect(answer));
  }

  length(): number {
    return this.questions.length;
  }

  private isCorrect(answer: Answer<any>): boolean {
    return this.currentQuestion.hasAnswer(answer);
  }

}
