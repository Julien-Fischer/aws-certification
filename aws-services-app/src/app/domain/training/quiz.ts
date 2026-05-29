import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "../scoring/models/percentage";

export class Result {

  readonly #brand = Symbol();

  constructor(
    readonly isCorrect: boolean,
    readonly progress: Percentage,
    readonly accuracy: Percentage
  ) { }

}

export class Quiz {

  readonly #brand = Symbol();

  private currentQuestion = this.questions[0];
  private progress = 0;
  private accuracy = 0;

  constructor(
    readonly questions: Question[]
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
  }

  submit(answer: Answer<any>): Result {
    this.progress++;
    const isCorrect = this.isCorrect(answer);
    if (isCorrect) {
      this.accuracy++;
    }
    return this.computeResult(isCorrect);
  }

  length(): number {
    return this.questions.length;
  }

  private computeResult(isCorrect: boolean) {
    return new Result(
      isCorrect,
      this.toPercentage(this.progress),
      this.toPercentage(this.accuracy)
    );
  }

  private isCorrect(answer: Answer<any>): boolean {
    return this.currentQuestion.hasAnswer(answer);
  }

  private toPercentage(progress: number): Percentage {
    return new Percentage(progress / this.length() * 100);
  }

}
