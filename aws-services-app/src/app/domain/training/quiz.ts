import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "./models/percentage";
import {QuizId} from "./quiz-id";

export class QuizOutcome {

  private static readonly SUCCESS_THRESHOLD = Percentage.FIFTY;

  readonly #brand = Symbol();

  constructor(
    readonly progress: Percentage,
    readonly accuracy: Percentage
  ) { }

  hasFailed(): boolean {
    return this.accuracy.isLessThan(QuizOutcome.SUCCESS_THRESHOLD);
  }

  hasSucceeded(): boolean {
    return !this.hasFailed();
  }

  hasMastered(): boolean {
    return this.accuracy.isMaximum();
  }

}

export class Result {

  readonly #brand = Symbol();

  constructor(
    readonly isAnswerCorrect: boolean,
    readonly progress: Percentage,
    readonly accuracy: Percentage,
    readonly expectedAnswer: Answer<any>,
    readonly explanation?: string,
    readonly outcome?: QuizOutcome
  ) { }

  isComplete(): boolean {
    return this.progress.isMaximum();
  }

}

export class Quiz {

  readonly #brand = Symbol();

  readonly _questions: Question[];

  private progress = 0;
  private accuracy = 0;

  private cursor = 0;
  private readonly _length: number;

  constructor(
    questions: Question[],
    readonly id: QuizId = QuizId.random()
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
    this._length = questions.length;
    this._questions = [...questions];
  }

  submit(answer: Answer<any>): Result {
    if (this.isAlreadyComplete()) {
      throw new Error('Quiz is already complete');
    }
    this.progress++;
    const result = this.evaluateAnswer(answer);
    this.nextQuestion();
    return result;
  }

  retry(): void {
    this.cursor = 0;
    this.progress = 0;
    this.accuracy = 0;
  }

  questions(): Question[] {
    return [...this._questions];
  }

  get length(): number {
    return this._length;
  }

  private nextQuestion(): Question {
    return this._questions[this.cursor++];
  }

  private get currentQuestion(): Question {
    return this._questions[this.cursor];
  }

  private evaluateAnswer(userAnswer: Answer<any>): Result {
    const isAnswerCorrect = this.isCorrect(userAnswer);
    const expectedAnswer = this.currentQuestion.answer;
    if (isAnswerCorrect) {
      this.accuracy++;
    }
    const progress = this.toPercentage(this.progress);
    const accuracy = this.toPercentage(this.accuracy);
    return new Result(
      isAnswerCorrect,
      progress,
      accuracy,
      expectedAnswer,
      this.getExplanationFor(userAnswer),
      this.isComplete() ? new QuizOutcome(progress, accuracy) : undefined
    );
  }

  private isCorrect(answer: Answer<any>): boolean {
    return this.currentQuestion.hasAnswer(answer);
  }

  private getExplanationFor(answer: Answer<any>): string | undefined {
    return this.currentQuestion.findExplanationFor(answer);
  }

  private toPercentage(progress: number): Percentage {
    return new Percentage(progress / this.length * 100);
  }

  private isAlreadyComplete(): boolean {
    return this.cursor === this.length;
  }

  private isComplete(): boolean {
    return this.cursor === this.length - 1;
  }

}
