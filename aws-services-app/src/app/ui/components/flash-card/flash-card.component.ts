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

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [CommonModule, QuizComponent, AppBackToHomeButtonComponent],
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

  loading: boolean = true;
  showNewHighscoreAnimation: boolean = false;

  private allMetadata: FlashCardMetadata[] = [];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private flashCardService: SearchService,
      @Inject(saveHighscoreInjectionToken) private saveHighscore: HighscoreEvaluator,
      @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider,
      @Inject(gamificationInjectionToken) private gamification: Gamification
  ) {}

  ngOnInit(): void {
    this.flashCardService.getAllMetadata().subscribe(metadata => {
      this.allMetadata = metadata;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.resetProgressTracker();
        this.loadService(new FlashCardId(id));
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

  private loadService(serviceId: FlashCardId): void {
    this.highscore = this.scoreProvider.get(serviceId);
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
    if (this.highscore.beats(previousHighscore)) {
      this.playAnimation();
    }
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

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.allMetadata.length - 1;
  }

  get previousCardName(): string {
    if (this.hasPrevious) {
      return this.allMetadata[this.currentIndex - 1].name;
    }
    return '';
  }

  get nextCardName(): string {
    if (this.hasNext) {
      return this.allMetadata[this.currentIndex + 1].name;
    }
    return '';
  }

  private get currentIndex(): number {
    return this.allMetadata.findIndex(metadata => metadata.id === this.service?.id);
  }

  navigateToPrevious(): void {
    if (this.hasPrevious) {
      const prevId = this.allMetadata[this.currentIndex - 1].id;
      this.router.navigate(['/service', prevId]);
    }
  }

  navigateToNext(): void {
    if (this.hasNext) {
      const nextId = this.allMetadata[this.currentIndex + 1].id;
      this.router.navigate(['/service', nextId]);
    }
  }

}
