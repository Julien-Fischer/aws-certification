import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import {
  SingleChoiceQuestion,
  Option,
  Question,
  BooleanQuestion,
  MultipleChoiceQuestion
} from "../../../domain/search/models/question";
import {ResultDto, SendAnswer} from "../../../infra/training/send-answer.service";
import Score from "../../../domain/scoring/models/score";
import Percentage from "../../../domain/scoring/models/percentage";
import {CreateQuiz, QuizDto, QuizRequest} from "../../../infra/training/create-quiz.service";

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
  protected selectedOption: string | Option | null = null;
  protected showFeedback: boolean = false;
  protected isCorrect: boolean = false;
  protected lastResult: ResultDto | null = null;
  protected quizCompleted: boolean = false;
  protected explanation: string | undefined = undefined;
  protected currentQuizOptions: QuizOptions | null = null;
  protected pendingNextQuestion: QuizOptions | null = null;

  private currentIndex: number = 0;
  private _questions: Question[] = [];

  private readonly requestMapper = new QuestionsToQuizRequest();

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
    this.quiz = this.sendQuizRequest();
    this.questionCount = this.quiz.questions;
    const index = this.questions.findIndex(question => question.label === this.quiz?.firstQuestion.label);
    if (index !== -1) {
      this.currentIndex = index;
    }
    this.initializeCurrentQuizOptions();
  }

  private initializeCurrentQuizOptions(): void {
    const firstQuestion = this.questions[this.currentIndex];
    if (firstQuestion && 'options' in firstQuestion && Array.isArray(firstQuestion.options)) {
      const singleChoiceQuestion = firstQuestion as SingleChoiceQuestion;
      this.currentQuizOptions = {
        label: singleChoiceQuestion.label,
        allowMultipleSelection: false,
        values: singleChoiceQuestion.options.map((option: Option) => `${option.prefix}.${option.label}`)
      };
    } else {
      this.currentQuizOptions = null;
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
    this.currentQuizOptions = null;
    this.pendingNextQuestion = null;

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

    const answerValue = this.createAnswer(this.selectedOption);

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

    this.storeNextQuestionData(result);

    this.onAnswer.emit(toScore(result));
  }

  private createAnswer(selectedOption: string | Option): string | boolean {
    return (typeof selectedOption === 'string')
      ? (selectedOption === 'true')
      : selectedOption!.prefix;
  }

  private storeNextQuestionData(result: ResultDto) {
    if (result.nextQuestion?.options) {
      this.pendingNextQuestion = {
        label: result.nextQuestion.label,
        allowMultipleSelection: result.nextQuestion.options.allowMultipleSelection,
        values: result.nextQuestion.options.values
      };
    } else if (result.nextQuestion) {
      this.pendingNextQuestion = {
        label: result.nextQuestion.label,
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

  get currentQuestion(): Question {
    return this.questions[this.currentIndex];
  }

  getCurrentQuestionLabel(): string {
    if (this.currentQuizOptions) {
      return this.currentQuizOptions.label;
    }
    return this.currentQuestion.label;
  }

  getCurrentQuestionOptions(): Option[] {
    if (this.currentQuizOptions) {
      return this.currentQuizOptions.values.map(subject => new Option(subject));
    }
    return [];
  }

  get renderedExplanation(): string {
    const explanation = this.explanation;
    return explanation ? (marked(explanation) as string) : '';
  }

  hasSucceeded(): boolean {
    return this.lastResult!.outcome!.hasSucceeded;
  }

  protected isLastQuestion(): boolean {
    return this.questionIndex === this.questionCount - 1;
  }

  selectOptionFromContext(option: Option): void {
    if (this.showFeedback) return;
    this.selectedOption = option;
  }

  matchesAnswerFromString(candidate: string): boolean {
    const expected = this.lastResult?.expectedAnswer;
    const candidateLetter = candidate.split('.')[0];
    return candidateLetter === expected;
  }

  hasOptions(): boolean {
    return this.currentQuizOptions !== null && this.currentQuizOptions?.values.length > 0;
  }

  protected trackOption(index: number, option: Option): string {
    return option.toString();
  }

  private sendQuizRequest(): QuizDto {
    return this.createQuiz.publish(this.createQuizRequest());
  }

  private createQuizRequest(): QuizRequest {
    return this.requestMapper.toQuizRequest(this.questions, true);
  }

  protected isOptionIncorrect(option: Option): boolean {
    return this.selectedOption?.toString() === option.toString() && !this.matchesAnswerFromString(option.toString());
  }

  protected isSelected(option: Option): boolean {
    return this.selectedOption?.toString() === option.toString();
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


class QuestionsToQuizRequest {

  public toQuizRequest(questions: Question[], shuffle: boolean): QuizRequest {
    return this.toRequest(
      this.getBooleanQuestions(questions),
      this.getSingleChoiceQuestions(questions),
      this.getMultipleChoiceQuestions(questions),
      shuffle
    );
  }

  private getBooleanQuestions(questions: Question[]): BooleanQuestion[] {
    return questions.filter(question => !this.hasOptions(question));
  }

  private getSingleChoiceQuestions(questions: Question[]): SingleChoiceQuestion[] {
    return questions.filter(question => this.hasOptions(question) && !Array.isArray(question.answer.value)) as SingleChoiceQuestion[];
  }

  private getMultipleChoiceQuestions(questions: Question[]): MultipleChoiceQuestion[] {
    return questions.filter(question => this.hasOptions(question) && Array.isArray(question.answer.value)) as MultipleChoiceQuestion[];
  }

  private hasOptions(question: Question): boolean {
    return 'options' in question;
  }

  private toRequest(
    booleanQuestions: BooleanQuestion[],
    singleChoiceQuestions: SingleChoiceQuestion[],
    multipleChoiceQuestions: MultipleChoiceQuestion[],
    shuffle: boolean,
  ): QuizRequest {
    return {
      booleanQuestions: booleanQuestions.map(question => ({
        label: question.label,
        answer: question.answer.value,
        explanation: question.answer.explanation
      })),
      singleChoiceQuestions: singleChoiceQuestions.map(question => ({
        label: question.label,
        answer: {
          value: question.answer.value.prefix,
          explanation: question.answer.explanation
        },
        options: question.options.map((option: Option) => option.toString())
      })),
      multipleChoiceQuestions: multipleChoiceQuestions.map(question => ({
        label: question.label,
        answer: question.answer.value.map(option => option.prefix),
        explanation: question.answer.explanation,
        options: question.options.map((option: Option) => option.toString())
      })),
      shuffle
    };
  }

}
