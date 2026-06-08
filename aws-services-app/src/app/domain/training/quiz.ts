import {Question} from "./models/questions/question";
import Percentage from "./models/percentage";
import {QuizId} from "./quiz-id";
import {UserAnswer} from "./models/user-answer";
import {ExpectedAnswer} from "./models/answers/expected-answer";

export class QuizOutcome {

  public static from(progress: Percentage, accuracy: Percentage): QuizOutcome {
    return new QuizOutcome(progress, accuracy);
  }

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
    readonly expectedAnswer: ExpectedAnswer<any>,
    readonly explanation?: string,
    readonly nextQuestion?: Question,
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

  submit(answer: UserAnswer): Result {
    if (this.isComplete()) {
      throw new Error('Quiz is already complete');
    }
    const result = this.processAnswer(answer);
    this.cursor++;
    return result;
  }

  retry(): void {
    this.progress = 0;
    this.accuracy = 0;
    this.cursor = 0;
  }

  questions(): Question[] {
    return [...this._questions];
  }

  get length(): number {
    return this._length;
  }

  private nextQuestion(): Question {
    return this._questions[this.cursor + 1];
  }

  private get currentQuestion(): Question {
    return this._questions[this.cursor];
  }

  private processAnswer(userAnswer: UserAnswer): Result {
    const isAnswerCorrect = this.isCorrect(userAnswer);
    const expectedAnswer = this.currentQuestion.answer;
    const explanation = this.getExplanationFor(userAnswer);

    if (isAnswerCorrect) {
      this.accuracy++;
    }
    this.progress++;

    const progress = this.toPercentage(this.progress);
    const accuracy = this.toPercentage(this.accuracy);
    const over = this.isComplete();

    return new Result(
      isAnswerCorrect,
      progress,
      accuracy,
      expectedAnswer,
      explanation,
      over ? undefined : this.nextQuestion(),
      over ? QuizOutcome.from(progress, accuracy) : undefined
    );
  }

  private isCorrect(answer: UserAnswer): boolean {
    return this.currentQuestion.hasAnswer(answer);
  }

  private getExplanationFor(answer: UserAnswer): string | undefined {
    return this.currentQuestion.explanation;
  }

  private toPercentage(progress: number): Percentage {
    return new Percentage(progress / this.length * 100);
  }

  private isComplete(): boolean {
    return this.progress === this.length;
  }

}
