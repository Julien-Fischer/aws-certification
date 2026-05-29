import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "../scoring/models/percentage";

export class Result {

  readonly #brand = Symbol();

  constructor(
    readonly isCorrect: boolean,
    readonly progress: Percentage,
    readonly accuracy: Percentage,
    readonly correctAnswer: Answer<any>
  ) { }

  isComplete(): boolean {
    return this.progress.isMaximum();
  }

}

export class Quiz {

  readonly #brand = Symbol();

  private cursor = 0;
  private currentQuestion = this.questions[0];
  private progress = 0;
  private accuracy = 0;

  constructor(
    private readonly questions: Question[]
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
  }

  submit(answer: Answer<any>): Result {
    if (this.isComplete()) {
      throw new Error('Quiz is already complete');
    }
    this.progress++;
    const result = this.evaluateAnswer(answer);
    this.nextQuestion();
    return result;
  }

  retry(): void {
    this.cursor = 0;
    this.currentQuestion = this.questions[0];
    this.progress = 0;
    this.accuracy = 0;
  }

  length(): number {
    return this.questions.length;
  }

  private nextQuestion(): Question {
    this.currentQuestion = this.questions[this.cursor++];
    return this.currentQuestion;
  }

  private evaluateAnswer(answer: Answer<any>): Result {
    const isCorrect = this.isCorrect(answer);
    const correctAnswer = this.currentQuestion.answer;
    if (isCorrect) {
      this.accuracy++;
    }
    return new Result(
      isCorrect,
      this.toPercentage(this.progress),
      this.toPercentage(this.accuracy),
      correctAnswer
    );
  }

  private isCorrect(answer: Answer<any>): boolean {
    return this.currentQuestion.hasAnswer(answer);
  }

  private toPercentage(progress: number): Percentage {
    return new Percentage(progress / this.length() * 100);
  }

  private isComplete(): boolean {
    return this.cursor === this.length();
  }

}
