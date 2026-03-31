import {Component, Inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Shuffler, shufflerInjectionToken} from "../../services/shuffler";
import {MultipleChoiceQuiz, Option, Quiz} from "../../../domain/learning/models/quiz";
import Ratio from "../../../domain/scoring/models/ratio";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {

  private static readonly SUCCESS_THRESHOLD = new Ratio(0.5);

  private _quizzes: Quiz[] = [];

  constructor(
      @Inject(shufflerInjectionToken) private shuffler: Shuffler
  ) {
  }

  @Input() onAnswer: (isCorrect: boolean) => void = () => {};
  @Input() onRetry: () => void = () => {};

  @Input()
  set quizzes(value: Quiz[]) {
    this._quizzes = this.shuffler.shuffle(value.map(quiz => {
      if (this.hasMultipleChoice(quiz)) {
        return this.suffleOptions(quiz as MultipleChoiceQuiz);
      }
      return quiz;
    }));
    this.resetQuiz();
  }

  get quizzes(): Quiz[] {
    return this._quizzes;
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

    const currentQuiz = this.quizzes[this.currentIndex];
    this.isCorrect = this.selectedOption.toString() === currentQuiz.answer.toString();
    if (this.isCorrect) {
      this.score++;
    }
    this.progress = Math.round((this.currentIndex + 1) / this.quizzes.length * 100);
    this.showFeedback = true;
    this.onAnswer(this.isCorrect);
  }

  nextQuestion(): void {
    if (this.currentIndex < this.quizzes.length - 1) {
      this.currentIndex++;
      this.selectedOption = null;
      this.showFeedback = false;
      this.isCorrect = false;
    } else {
      this.quizCompleted = true;
    }
  }

  get currentQuiz(): Quiz {
    return this.quizzes[this.currentIndex];
  }

  hasSucceeded(): boolean {
    return QuizComponent.SUCCESS_THRESHOLD.isLessThan(this.correctAnswersRatio());
  }

  matchesAnswer(candidate: string): boolean;
  matchesAnswer(candidate: Option): boolean;
  matchesAnswer(candidate: string | Option): boolean {
    if (typeof candidate === 'string') {
      return this.currentQuiz.answer.toString() === candidate;
    }
    return this.currentQuiz.answer.value.hasPrefix(candidate.prefix);
  }

  private correctAnswersRatio(): Ratio {
    return new Ratio(this.score / this.quizzes.length);
  }

  private hasMultipleChoice(quiz: Quiz | (Quiz & { options: unknown })) {
    return 'options' in quiz && Array.isArray(quiz.options);
  }

  private suffleOptions(quiz: MultipleChoiceQuiz) {
    return {
      ...quiz,
      options: this.shuffler.shuffle([...quiz.options])
    } as MultipleChoiceQuiz;
  }

  protected readonly Array = Array;
}
