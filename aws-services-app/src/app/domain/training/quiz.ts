import {Question} from "./models/question";
import {Answer} from "./models/answer";
import Percentage from "./models/percentage";
import {QuizId} from "./quiz-id";

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

  private progress = 0;
  private accuracy = 0;

  private cursor = 0;
  private readonly _length: number;

  constructor(
    private readonly questions: Question[],
    readonly id: QuizId = QuizId.random()
  ) {
    if (questions.length === 0) {
      throw new Error('No questions provided');
    }
    this._length = questions.length;
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
    this.progress = 0;
    this.accuracy = 0;
  }

  get length(): number {
    return this._length;
  }

  private nextQuestion(): Question {
    return this.questions[this.cursor++];
  }

  private get currentQuestion(): Question {
    return this.questions[this.cursor];
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
    return new Percentage(progress / this.length * 100);
  }

  private isComplete(): boolean {
    return this.cursor === this.length;
  }

}
