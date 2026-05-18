import {Component, Inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Shuffler, shufflerInjectionToken} from "../../services/shuffler";
import {MultipleChoiceQuestion, Option, Question} from "../../../domain/learning/models/question";
import Ratio from "../../../domain/scoring/models/ratio";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {

  private static readonly SUCCESS_THRESHOLD = Ratio.HALF;

  private _questions: Question[] = [];

  constructor(
      @Inject(shufflerInjectionToken) private shuffler: Shuffler
  ) {
  }

  @Input() onAnswer: (isCorrect: boolean) => void = () => {};
  @Input() onRetry: () => void = () => {};

  @Input()
  set questions(value: Question[]) {
    this._questions = this.shuffler.shuffle(value.map(question => {
      if (this.hasMultipleChoice(question)) {
        return this.suffleOptions(question as MultipleChoiceQuestion);
      }
      return question;
    }));
    this.resetQuiz();
  }

  get questions(): Question[] {
    return this._questions;
  }

  currentIndex: number = 0;
  selectedOption: string | null = null;
  showFeedback: boolean = false;
  isCorrect: boolean = false;
  quizCompleted: boolean = false;
  score: number = 0;
  progress: number = 0;

  ngOnInit(): void {
  }

  resetQuiz(): void {
    this.currentIndex = 0;
    this.selectedOption = null;
    this.showFeedback = false;
    this.isCorrect = false;
    this.quizCompleted = false;
    this.score = 0;
    this.progress = 0;
    this.onRetry();
  }

  selectOption(option: string): void {
    if (this.showFeedback) return;
    this.selectedOption = option;
  }

  checkAnswer(): void {
    if (!this.selectedOption) return;

    const currentQuestion = this.questions[this.currentIndex];
    this.isCorrect = this.selectedOption.toString() === currentQuestion.answer.toString();
    if (this.isCorrect) {
      this.score++;
    }
    this.progress = Math.round((this.currentIndex + 1) / this.questions.length * 100);
    this.showFeedback = true;
    this.onAnswer(this.isCorrect);
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.selectedOption = null;
      this.showFeedback = false;
      this.isCorrect = false;
    } else {
      this.quizCompleted = true;
    }
  }

  get currentQuestion(): Question {
    return this.questions[this.currentIndex];
  }

  hasSucceeded(): boolean {
    return QuizComponent.SUCCESS_THRESHOLD.isLessThan(this.correctAnswersRatio());
  }

  matchesAnswer(candidate: string): boolean;
  matchesAnswer(candidate: Option): boolean;
  matchesAnswer(candidate: string | Option): boolean {
    if (typeof candidate === 'string') {
      return this.currentQuestion.answer.toString() === candidate;
    }
    return this.currentQuestion.answer.value.hasPrefix(candidate.prefix);
  }

  private correctAnswersRatio(): Ratio {
    return new Ratio(this.score / this.questions.length);
  }

  private hasMultipleChoice(question: Question | (Question & { options: unknown })) {
    return 'options' in question && Array.isArray(question.options);
  }

  private suffleOptions(question: MultipleChoiceQuestion) {
    return {
      ...question,
      options: this.shuffler.shuffle([...question.options])
    } as MultipleChoiceQuestion;
  }

  protected readonly Array = Array;
}
