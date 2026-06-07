import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import {MultipleChoiceQuestion, Option, Question, BooleanQuestion} from "../../../domain/search/models/question";
import {ResultDto, SendAnswer} from "../../../infra/training/send-answer.service";
import Score from "../../../domain/scoring/models/score";
import Percentage from "../../../domain/scoring/models/percentage";
import {CreateQuiz, QuizDto, QuizRequest} from "../../../infra/training/create-quiz.service";

export interface ProgressUpdate {
  score: Score;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {

  accuracy: number = 0;
  progress: number = 0;

  protected questionIndex: number = 0;
  protected questionCount: number = 0;
  protected selectedOption: string | Option | null = null;
  protected showFeedback: boolean = false;
  protected isCorrect: boolean = false;
  protected lastResult: ResultDto | null = null;
  protected quizCompleted: boolean = false;
  protected explanation: string | undefined = undefined;

  private currentIndex: number = 0;
  private _questions: Question[] = [];

  constructor(
      private sendAnswer: SendAnswer,
      private createQuiz: CreateQuiz
  ) {
  }

  quiz: QuizDto | undefined;
  @Output() onAnswer = new EventEmitter<ProgressUpdate>();
  @Input() onRetry: () => void = () => {};

  @Input()
  set questions(value: Question[]) {
    this._questions = value;
    this.resetQuiz();
  }

  get questions(): Question[] {
    return this._questions;
  }

  private startQuiz(): void {
    const booleanQuestions = this._questions.filter(question => !('options' in question)) as BooleanQuestion[];
    const multipleChoiceQuestions = this._questions.filter(q => 'options' in q) as MultipleChoiceQuestion[];

    const request: QuizRequest = {
      booleanQuestions: booleanQuestions.map(question => ({
        label: question.label,
        answer: question.answer.value,
        explanation: question.answer.explanation
      })),
      multipleChoiceQuestions: multipleChoiceQuestions.map(question => ({
        label: question.label,
        answer: {
          value: question.answer.value.prefix,
          explanation: question.answer.explanation
        },
        options: question.options.map((option: Option) => `${option.prefix}.${option.label}`)
      })),
      shuffle: true
    };
    const dto = this.createQuiz.publish(request);
    this.quiz = dto;
    this.questionCount = dto.questions;
    const index = this.questions.findIndex(question => question.label === this.quiz?.firstQuestion.label);
    if (index !== -1) {
      this.currentIndex = index;
    }
  }

  resetQuiz(): void {
    this.selectedOption = null;
    this.showFeedback = false;
    this.isCorrect = false;
    this.lastResult = null;
    this.quizCompleted = false;
    this.accuracy = 0;
    this.progress = 0;
    this.questionIndex = 0;
    this.explanation = undefined;

    if (this.questions.length > 0) {
      this.startQuiz();
      this.onRetry();
    }
  }

  selectOption(option: string | Option): void {
    if (this.showFeedback) return;
    this.selectedOption = option as any;
  }

  checkAnswer(): void {
    if (!this.selectedOption) return;

    const answerValue = (typeof this.selectedOption === 'string')
      ? (this.selectedOption === 'true')
      : (this.selectedOption as Option).prefix;

    const result: ResultDto = this.sendAnswer.send({
      quizId: this.quiz!.id,
      answer: answerValue
    });

    this.lastResult = result;
    this.accuracy = result.accuracy;
    this.progress = result.progress;
    this.explanation = result.explanation;
    this.showFeedback = true;
    this.isCorrect = result.isAnswerCorrect;
    this.onAnswer.emit(toScore(result));
  }

  nextQuestion(): void {
    if (this.lastResult?.nextQuestion) {
      const nextIndex = this.questions.findIndex(q => q.label === this.lastResult?.nextQuestion);
      if (nextIndex !== -1) {
        this.currentIndex = nextIndex;
        this.selectedOption = null;
        this.showFeedback = false;
        this.isCorrect = false;
        this.lastResult = null;
        this.questionIndex++;
      } else {
        console.error('Next question not found in the list', this.lastResult.nextQuestion);
        this.quizCompleted = true;
      }
    } else {
      this.quizCompleted = true;
    }
  }

  get currentQuestion(): Question {
    return this.questions[this.currentIndex];
  }

  get renderedExplanation(): string {
    const explanation = this.explanation;
    return explanation ? (marked(explanation) as string) : '';
  }

  hasSucceeded(): boolean {
    return this.lastResult!.outcome!.hasSucceeded;
  }

  matchesAnswer(candidate: string): boolean;
  matchesAnswer(candidate: Option): boolean;
  matchesAnswer(candidate: string | Option): boolean {
    const expected = this.lastResult?.expectedAnswer;
    const actual = (typeof candidate === 'string') ? candidate : candidate.prefix;
    return expected === actual;
  }

  protected isLastQuestion(): boolean {
    return this.questionIndex === this.questionCount - 1;
  }

  protected readonly Array = Array;
}


function toScore(result: ResultDto): ProgressUpdate {
  return {
    score: new Score(
      new Percentage(result.progress),
      new Percentage(result.accuracy)
    )
  }
}
