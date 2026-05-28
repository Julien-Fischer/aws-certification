import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {ActivatedRoute, RouterLink} from '@angular/router';
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
import { FlashCardId } from "../../../domain/shared/flash-card-id";
import { Confetti } from "../../animations/confetti";
import { Gamification, gamificationInjectionToken } from "../../../domain/scoring/gamification";
import { AppBackToHomeButtonComponent } from "../generic/back-to-home-button.component";
import { forgetHighscoreInjectionToken, HighscoreEraser } from "../../../domain/scoring/highscore-eraser";
import { AppTextPopComponent } from "../../animations/text-pop.component";
import { HighscoreDetailsComponent } from "./highscore-details/highscore-details.component";
import { FlashCardNavigationComponent } from "./flash-card-navigation.component";
import { FlashCardHeaderComponent } from "./flash-card-header.component";

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [
    CommonModule,
    QuizComponent,
    AppBackToHomeButtonComponent,
    AppTextPopComponent,
    HighscoreDetailsComponent,
    FlashCardNavigationComponent,
    FlashCardHeaderComponent
  ],
  templateUrl: './flash-card.component.html',
  styleUrl: './flash-card.component.scss',
})
export class FlashCardComponent implements OnInit, OnDestroy {

  service: FlashCardMetadata | undefined;
  markdownContent: string = '';
  questions: Question[] = [];
  progressTracker = this.trackProgress();
  highscore: Highscore = Highscore.NONE;
  firstAttempt: boolean = true;
  newHighscoreUnlocked = false;

  protected flashcardId: FlashCardId | undefined = undefined;
  protected loading: boolean = true;
  @ViewChild(AppTextPopComponent) textPopComponent!: AppTextPopComponent;

  private resetSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private flashCardService: SearchService,
    @Inject(saveHighscoreInjectionToken) private saveHighscore: HighscoreEvaluator,
    @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider,
    @Inject(gamificationInjectionToken) protected gamification: Gamification,
    @Inject(forgetHighscoreInjectionToken) private forgetHighscore: HighscoreEraser
  ) {}

  ngOnInit(): void {
    this.resetSubscription = this.forgetHighscore.onReset.subscribe(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadHighscore(new FlashCardId(id));
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.resetProgressTracker();
        this.flashcardId = new FlashCardId(id);
        this.loadService(this.flashcardId);
      } else {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.resetSubscription?.unsubscribe();
  }

  private serviceId(): FlashCardId {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      throw new Error('ID parameter is missing');
    }
    return new FlashCardId(idParam);
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
        if (service === null) {
          this.loading = true;
          return;
        }

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
        this.questions = [...trueFalseQuestions, ...multipleChoiceQuestions];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading markdown content:', error);
        this.markdownContent = '<p>Error loading content. Please try again later.</p>';
        this.loading = false;
      }
    });
  }

  async onProgress(correct: boolean) {
    await this.updateProgress(this.progressTracker, correct);
  }

  resetProgressTracker() {
    this.progressTracker = this.trackProgress();
    this.newHighscoreUnlocked = false;
  }

  private trackProgress() {
    return new ProgressTracker(() => this.questions.length);
  }

  private async updateProgress(tracker: ProgressTracker, correct: boolean) {
    tracker.update(correct);
    const score = tracker.score;
    await this.notifyScore(score);
  }

  private async notifyScore(score: Score) {
    const previousHighscore = this.highscore;
    this.highscore = await this.saveHighscore.submit(this.serviceId(), score);
    if (this.shouldRewardUser(previousHighscore)) {
      this.rewardUser();
    }
    this.firstAttempt = false;
  }

  private shouldRewardUser(previousHighscore: Highscore) {
    return this.gamification.isEnabled() && this.isRewardDeserved(previousHighscore);
  }

  private isRewardDeserved(previousHighscore: Highscore): boolean {
    return this.highscore.hasBetterAccuracyThan(previousHighscore) && !this.firstAttempt;
  }

  private rewardUser() {
    if (this.hasMasteredQuiz()) {
      Confetti.burst();
    } else {
      if (!this.newHighscoreUnlocked) {
        this.unlockNewHighscore();
      }
    }
  }

  private hasMasteredQuiz() {
    return this.highscore.isMaximum();
  }

  private unlockNewHighscore() {
    this.textPopComponent.pop();
    this.newHighscoreUnlocked = true;
  }

  resetHighscore(): void {
    if (this.service) {
      this.forgetHighscore.forget(new FlashCardId(this.service.id));
      this.highscore = Highscore.NONE;
      this.firstAttempt = true;
      this.resetProgressTracker();
    }
  }

}
