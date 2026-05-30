import {Component, OnInit, ViewChild, OnDestroy, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {ActivatedRoute} from '@angular/router';
import { SearchService } from '../../../domain/search/services/search.service';
import { FlashCardMetadata } from '../../../domain/search/models/metadata';
import { marked } from 'marked';
import {ProgressUpdate, QuizComponent} from '../quiz/quiz.component';
import { FlashCard } from '../../../domain/search/models/flash-card';
import Score from '../../../domain/scoring/models/score';
import Highscore from '../../../domain/scoring/models/highscore';
import { FlashCardId } from "../../../domain/shared/flash-card-id";
import {Confetti, confettiInjectionToken} from "../../animations/confetti";
import { AppBackToHomeButtonComponent } from "../generic/back-to-home-button.component";
import { AppTextPopComponent } from "../../animations/text-pop.component";
import { HighscoreDetailsComponent } from "./highscore-details/highscore-details.component";
import { FlashCardNavigationComponent } from "./flash-card-navigation.component";
import { FlashCardHeaderComponent } from "./flash-card-header.component";
import {ScoringAppService, AnswerResult} from "../../../domain/scoring/scoring-application.service";
import {Question} from "../../../domain/search/models/question";

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

  flashCard: FlashCardMetadata | undefined;
  markdownContent: string = '';
  highscore: Highscore = Highscore.NONE;
  firstAttempt: boolean = true;
  newHighscoreUnlocked = false;

  protected flashcardId: FlashCardId | undefined = undefined;
  loading: boolean = true;
  @ViewChild(AppTextPopComponent) textPopComponent!: AppTextPopComponent;

  private resetSubscription: Subscription | undefined;
  protected questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private flashCardService: SearchService,
    private scoringAppService: ScoringAppService,
    @Inject(confettiInjectionToken) private confetti: Confetti
  ) {}

  ngOnInit(): void {
    this.resetSubscription = this.scoringAppService.onReset.subscribe(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadHighscore(new FlashCardId(id));
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
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

  get showHighscoreDetails(): boolean {
    return this.scoringAppService.isGamificationEnabled();
  }

  private loadService(serviceId: FlashCardId): void {
    this.loadHighscore(serviceId);
    this.loadContent(serviceId);
  }

  private loadHighscore(serviceId: FlashCardId): void {
    this.highscore = this.scoringAppService.getHighscore(serviceId);
    this.firstAttempt = this.scoringAppService.isFirstAttempt(this.highscore);
  }

  private loadContent(serviceId: FlashCardId): void {
    this.flashCardService.getMetadata(serviceId).subscribe(service => {
      if (service === null) {
        this.loading = true;
        return;
      }
      this.flashCard = service;
      this.loadMarkdownContent(serviceId);
      this.loading = false;
    });
  }

  private loadMarkdownContent(id: FlashCardId): void {
    this.flashCardService.getFlashCard(id).subscribe({
      next: (card: FlashCard) => {
        if (!card) {
          return;
        }
        const { mainContent, booleanQuestions, multipleChoiceQuestions } = card;
        const renderer = tableRenderer();

        this.markdownContent = marked(mainContent, { renderer }) as string;
        this.questions = [...booleanQuestions, ...multipleChoiceQuestions];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading markdown content:', error);
        this.markdownContent = '<p>Error loading Markdown content. Please try again later.</p>';
        this.loading = false;
      }
    });
  }

  async onProgress(progressUpdate: ProgressUpdate) {
    await this.notifyScore(progressUpdate.score);
  }

  private async notifyScore(score: Score) {
    if (!this.flashcardId) return;

    const result = await this.scoringAppService.submitAnswer(this.flashcardId, score);
    this.highscore = result.highscore;
    this.firstAttempt = false;

    if (result.deservesReward) {
      this.rewardUser(result);
    }
  }

  private rewardUser(result: AnswerResult) {
    if (result.isMaximum) {
      this.confetti.burst();
    } else if (!this.newHighscoreUnlocked) {
      this.textPopComponent.pop();
      this.newHighscoreUnlocked = true;
    }
  }

  resetHighscore(): void {
    if (!this.flashcardId) return;
    this.scoringAppService.resetHighscore(this.flashcardId);
    this.highscore = Highscore.NONE;
    this.firstAttempt = true;
  }
}

function tableRenderer() {
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
          <thead>${renderer.tablerow({text: header})}</thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  };

  return renderer;
}
