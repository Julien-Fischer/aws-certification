import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import {Option} from "../../../domain/search/models/question";
import {ResultDto, SendAnswer} from "../../../infra/training/send-answer.service";
import {UserAnswer} from "../../../domain/training/models/user-answer";
import Score from "../../../domain/scoring/models/score";
import Percentage from "../../../domain/scoring/models/percentage";
import {QuestionDto, QuizDto} from "../../../infra/training/create-quiz.service";

export interface ProgressUpdate {
  score: Score;
}

export interface QuizOptions {
  label: string;
  allowMultipleSelection: boolean;
  values: string[];
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
  protected selectedOption: string | Option | (string | Option)[] | null = null;
  protected showFeedback: boolean = false;
  protected isCorrect: boolean = false;
  protected lastResult: ResultDto | null = null;
  protected quizCompleted: boolean = false;
  protected explanation: string | undefined = undefined;
  protected currentQuizOptions: QuizOptions | null = null;
  protected pendingNextQuestion: QuizOptions | null = null;

  private _quiz: QuizDto | undefined;

  constructor(
    private sendAnswer: SendAnswer,
  ) {
  }

  @Output() onAnswer = new EventEmitter<ProgressUpdate>();
  @Input() onRetry: () => void = () => {};

  @Input()
  set quiz(value: QuizDto | undefined) {
    this._quiz = value;
    this.resetState();
    if (this._quiz) {
      this.startQuiz();
    }
  }

  get quiz(): QuizDto | undefined {
    return this._quiz;
  }

  private startQuiz(): void {
    if (!this._quiz) return;
    this.questionCount = this._quiz.questions;
    this.initializeCurrentQuizOptions();
  }

  private initializeCurrentQuizOptions(): void {
    if (!this._quiz) return;
    const firstQuestion = this._quiz.firstQuestion;
    this.currentQuizOptions = this.mapQuestion(firstQuestion);
  }

  private mapQuestion(firstQuestion: QuestionDto): QuizOptions {
    const hasOptions = firstQuestion.options && firstQuestion.options.length > 0;
    return {
        label: firstQuestion.label,
        allowMultipleSelection: firstQuestion.multipleSelection === true,
        values: hasOptions ? firstQuestion.options!.map((option: Option) => option.toString()) : []
      };
  }

  private resetState(): void {
    this.selectedOption = null;
    this.showFeedback = false;
    this.isCorrect = false;
    this.lastResult = null;
    this.quizCompleted = false;
    this.accuracy = 0;
    this.progress = 0;
    this.questionIndex = 0;
    this.explanation = undefined;
    this.currentQuizOptions = null;
    this.pendingNextQuestion = null;
  }

  resetQuiz(): void {
    this.resetState();
    this.onRetry();
  }

  selectOption(option: string | Option): void {
    if (this.showFeedback) return;

    if (this.currentQuizOptions?.allowMultipleSelection) {
      this.toggleSelectedOption(option);
    } else {
      this.selectedOption = option as any;
    }
  }

  private toggleSelectedOption(option: string | Option): void {
    const currentSelection = Array.isArray(this.selectedOption)
      ? this.selectedOption
      : (this.selectedOption ? [this.selectedOption] : []);

    const index = currentSelection.findIndex(o => this.areOptionsEqual(o, option));

    if (index === -1) {
      this.selectedOption = [...currentSelection, option];
    } else {
      const newSelection = [...currentSelection];
      newSelection.splice(index, 1);
      this.selectedOption = newSelection.length > 0 ? newSelection : null;
    }
  }

  private areOptionsEqual(a: string | Option, b: string | Option): boolean {
    if (typeof a === 'string' || typeof b === 'string') {
      return a === b;
    }
    return a.equals(b);
  }

  checkAnswer(): void {
    if (!this.selectedOption) return;

    const answerValue = this.createAnswer(this.selectedOption);

    const result: ResultDto = this.sendAnswer.send({
      quizId: this._quiz!.id,
      answer: answerValue
    });

    this.lastResult = result;
    this.accuracy = result.accuracy;
    this.progress = result.progress;
    this.explanation = result.explanation;
    this.showFeedback = true;
    this.isCorrect = result.isAnswerCorrect;

    this.storeNextQuestionData(result);

    this.onAnswer.emit(toScore(result));
  }

  private createAnswer(selectedOption: string | Option | (string | Option)[]): UserAnswer {
    if (Array.isArray(selectedOption)) {
      return selectedOption.map(option => (option as Option).prefix);
    }
    return (typeof selectedOption === 'string')
      ? (selectedOption === 'true')
      : (selectedOption as Option).prefix;
  }

  private storeNextQuestionData(result: ResultDto) {
    const nextQuestion = result.nextQuestion;
    if (nextQuestion?.options) {
      this.pendingNextQuestion = {
        label: nextQuestion.label,
        allowMultipleSelection: nextQuestion.options.allowMultipleSelection,
        values: nextQuestion.options.values
      };
    } else if (nextQuestion) {
      this.pendingNextQuestion = {
        label: nextQuestion.label,
        allowMultipleSelection: false,
        values: []
      };
    }
  }

  nextQuestion(): void {
    if (this.lastResult?.nextQuestion) {
      // Now apply the pending next question
      this.currentQuizOptions = this.pendingNextQuestion;
      this.pendingNextQuestion = null;

      this.selectedOption = null;
      this.showFeedback = false;
      this.isCorrect = false;
      this.lastResult = null;
      this.questionIndex++;
    } else {
      this.quizCompleted = true;
    }
  }

  getCurrentQuestionLabel(): string {
    return this.currentQuizOptions?.label ?? '';
  }

  getCurrentQuestionOptions(): Option[] {
    return this.currentQuizOptions == null
      ? []
      : this.currentQuizOptions.values.map(subject => new Option(subject));
  }

  get renderedExplanation(): string {
    const explanation = this.explanation;
    return explanation ? (marked(explanation) as string) : '';
  }

  hasSucceeded(): boolean {
    return this.lastResult!.outcome !== 'FAIL';
  }

  protected isLastQuestion(): boolean {
    return this.questionIndex === this.questionCount - 1;
  }

  selectOptionFromContext(option: Option): void {
    this.selectOption(option);
  }

  matchesAnswerFromString(candidate: string): boolean {
    const expected = this.lastResult?.expectedAnswer;
    const candidateLetter = candidate.split('.')[0];
    if (Array.isArray(expected)) {
      return expected.includes(candidateLetter);
    }
    return candidateLetter === expected;
  }

  hasOptions(): boolean {
    return this.currentQuizOptions !== null && (this.currentQuizOptions?.values?.length ?? 0) > 0;
  }

  protected trackOption(index: number, option: Option): string {
    return option.toString();
  }


  protected isOptionIncorrect(option: Option): boolean {
    return this.isSelected(option) && !this.matchesAnswerFromString(option.toString());
  }

  protected isSelected(option: Option): boolean {
    if (Array.isArray(this.selectedOption)) {
      return this.selectedOption.some(o => (o as Option).equals(option));
    }
    return option.equals(this.selectedOption as Option);
  }

}

function toScore(result: ResultDto): ProgressUpdate {
  return {
    score: new Score(
      new Percentage(result.progress),
      new Percentage(result.accuracy)
    )
  }
}



