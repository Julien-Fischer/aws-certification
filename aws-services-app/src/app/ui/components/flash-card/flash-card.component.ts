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
import { SaveHighscore, saveHighscoreInjectionToken } from '../../../domain/scoring/save-highscore';
import { ScoreProvider, scoreProviderInjectionToken } from '../../../domain/scoring/score-provider';
import ProgressTracker from './progress-tracker';
import {FlashCardId} from "../../../domain/shared/flash-card-id";

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [CommonModule, QuizComponent],
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

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private flashCardService: SearchService,
      @Inject(saveHighscoreInjectionToken) private saveHighscore: SaveHighscore,
      @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider
  ) {}

  ngOnInit(): void {
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

  private async onProgressUpdate(tracker: ProgressTracker, correct: boolean) {
    tracker.update(correct);
    const score = tracker.score;
    await this.notifyScore(score);
  }

  private async notifyScore(score: Score) {
    this.highscore = await this.saveHighscore.submit(this.serviceId(), score);
  }

  resetProgressTracker() {
    this.progressTracker = this.trackProgress();
  }

  private trackProgress() {
    return new ProgressTracker(() => this.allQuestions.length);
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
