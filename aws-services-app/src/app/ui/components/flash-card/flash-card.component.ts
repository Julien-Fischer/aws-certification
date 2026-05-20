import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../domain/search/services/search.service';
import { FlashCardMetadata } from '../../../domain/search/models/metadata';
import { marked } from 'marked';
import { QuizComponent } from '../quiz/quiz.component';
import { Question } from '../../../domain/search/models/question';
import { FlashCard } from '../../../domain/search/models/flash-card';
import Score from '../../../domain/scoring/models/score';
import Highscore from '../../../domain/scoring/models/highscore';
import { HighscoreEvaluator, saveHighscoreInjectionToken } from '../../../domain/scoring/highscore-evaluator';
import { ScoreProvider, scoreProviderInjectionToken } from '../../../domain/scoring/score-provider';
import ProgressTracker from './progress-tracker';
import {FlashCardId} from "../../../domain/shared/flash-card-id";
import {Confetti} from "../../animations/confetti";
import {Gamification, gamificationInjectionToken} from "../../services/gamification";
import {AppBackToHomeButtonComponent} from "../generic/back-to-home-button.component";
import {Carousel, carouselInjectionToken} from "../../../domain/search/carousel";
import {ScoreIndicatorComponent} from "../generic/score-indicator.component";
import {forgetHighscoreInjectionToken, HighscoreEraser} from "../../../domain/scoring/highscore-eraser";

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [CommonModule, QuizComponent, AppBackToHomeButtonComponent, ScoreIndicatorComponent],
  templateUrl: './flash-card.component.html',
  styleUrl: './flash-card.component.scss',
})
export class FlashCardComponent implements OnInit {
  service: FlashCardMetadata | undefined;
  markdownContent: string = '';
  trueFalseQuestions: Question[] = [];
  multipleChoiceQuestions: Question[] = [];
  allQuestions: Question[] = [];
  progressTracker = this.trackProgress();
  highscore: Highscore = Highscore.NONE;
  readonly highscoreNONE = Highscore.NONE;
  firstAttempt: boolean = true;

  loading: boolean = true;
  showNewHighscoreAnimation: boolean = false;

  nextCard: FlashCardMetadata | undefined;
  prevCard: FlashCardMetadata | undefined;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private flashCardService: SearchService,
      @Inject(carouselInjectionToken) private carousel: Carousel,
      @Inject(saveHighscoreInjectionToken) private saveHighscore: HighscoreEvaluator,
      @Inject(forgetHighscoreInjectionToken) private forgetHighscore: HighscoreEraser,
      @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider,
      @Inject(gamificationInjectionToken) protected gamification: Gamification
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.resetProgressTracker();
        let flashCardId = new FlashCardId(id);
        this.loadService(flashCardId);
        this.loadNeighboringCards(flashCardId);
      } else {
        this.loading = false;
      }
    });
  }

  private serviceId(): FlashCardId {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      throw new Error('ID parameter is missing');
    }
    return new FlashCardId(idParam);
  }

  private loadNeighboringCards(serviceId: FlashCardId): void {
    this.carousel.next(serviceId).subscribe(nextCard => {
      this.nextCard = nextCard;
    })
    this.carousel.prev(serviceId).subscribe(prevCard => {
      this.prevCard = prevCard;
    })
  }

  private loadService(serviceId: FlashCardId): void {
    this.loadHighscore(serviceId);
    this.loadContent(serviceId);
  }

  private loadHighscore(serviceId: FlashCardId): void {
    this.highscore = this.scoreProvider.get(serviceId);
    if (this.highscore.beats(Highscore.NONE)) {
      this.firstAttempt = false;
    }
  }

  private loadContent(serviceId: FlashCardId): void {
    this.flashCardService.getMetadata(serviceId).subscribe(
      service => {
        this.service = service;
        if (service) {
          this.loadMarkdownContent(serviceId);
        } else {
          this.loading = false;
        }
      }
    );
  }

  private loadMarkdownContent(id: FlashCardId): void {
    this.flashCardService.getFlashCard(id).subscribe({
      next: (card: FlashCard) => {
        const { mainContent, trueFalseQuestions, multipleChoiceQuestions } = card;

        const renderer = new marked.Renderer();
        renderer.table = (token) => {
          const header = token.header.map(cell => renderer.tablecell(cell)).join('');
          const body = token.rows.map(row => {
            return renderer.tablerow({
              text: row.map(cell => renderer.tablecell(cell)).join('')
            });
          }).join('');

          return `
            <div class="table-responsive">
              <table class="table">
                <thead>${renderer.tablerow({ text: header })}</thead>
                <tbody>${body}</tbody>
              </table>
            </div>
          `;
        };

        this.markdownContent = marked(mainContent, { renderer }) as string;
        this.trueFalseQuestions = trueFalseQuestions;
        this.multipleChoiceQuestions = multipleChoiceQuestions;
        this.allQuestions = [...this.trueFalseQuestions, ...this.multipleChoiceQuestions];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading markdown content:', error);
        this.markdownContent = '<p>Error loading content. Please try again later.</p>';
        this.loading = false;
      }
    });
  }

  async onTrueFalseScoreChange(correct: boolean) {
    await this.onProgressUpdate(this.progressTracker, correct);
  }

  async onMultipleChoiceScoreChange(correct: boolean) {
    await this.onProgressUpdate(this.progressTracker, correct);
  }

  resetProgressTracker() {
    this.progressTracker = this.trackProgress();
  }

  private trackProgress() {
    return new ProgressTracker(() => this.allQuestions.length);
  }

  private async onProgressUpdate(tracker: ProgressTracker, correct: boolean) {
    tracker.update(correct);
    const score = tracker.score;
    await this.notifyScore(score);
  }

  private async notifyScore(score: Score) {
    const previousHighscore = this.highscore;
    this.highscore = await this.saveHighscore.submit(this.serviceId(), score);
    if (this.gamification.isEnabled()) {
      this.gamify(previousHighscore);
    }
  }

  private gamify(previousHighscore: Highscore) {
    if (this.shouldPlayAnimationFor(previousHighscore)) {
      this.playAnimation();
    }
  }

  private shouldPlayAnimationFor(previousHighscore: Highscore): boolean {
    console.log('this.firstAttempt: ', this.firstAttempt)
    return this.highscore.beats(previousHighscore) && !this.firstAttempt;
  }

  private playAnimation() {
    if (this.highscore.isMaximum()) {
      Confetti.burst();
    } else {
      this.animateNewHighscore();
    }
  }

  private animateNewHighscore() {
    this.showNewHighscoreAnimation = true;
    setTimeout(() => {
      this.showNewHighscoreAnimation = false;
    }, 2000);
  }

  get previousCardName(): string {
    return this.prevCard?.name || '';
  }

  get nextCardName(): string {
    return this.nextCard?.name || '';
  }

  navigateToPrevious(): void {
    this.navigateTo(this.prevCard);
  }

  navigateToNext(): void {
    this.navigateTo(this.nextCard);
  }

  resetHighscore(): void {
    if (this.service) {
      this.forgetHighscore.forget(new FlashCardId(this.service.id));
      this.highscore = Highscore.NONE;
    }
  }

  private navigateTo(card: FlashCardMetadata | undefined): void {
    this.router.navigate(['/service', card?.id]);
  }

}
