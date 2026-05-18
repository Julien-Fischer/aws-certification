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
import { ScoreWriter, scoreWriterInjectionToken } from '../../../domain/scoring/score-writer';
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
      @Inject(scoreWriterInjectionToken) private scoreWriter: ScoreWriter,
      @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider
  ) {}

  ngOnInit(): void {
    const serviceId = this.serviceId();
    if (serviceId) {
      this.loadService(serviceId);
    } else {
      this.loading = false;
    }
  }

  private serviceId(): FlashCardId {
    const idParam = this.route.snapshot.paramMap.get('id')!;
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
        this.markdownContent = marked(mainContent) as string;
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

  onTrueFalseScoreChange(correct: boolean) {
    this.onProgressUpdate(this.progressTracker, correct);
  }

  onMultipleChoiceScoreChange(correct: boolean) {
    this.onProgressUpdate(this.progressTracker, correct);
  }

  private onProgressUpdate(tracker: ProgressTracker, correct: boolean) {
    tracker.update(correct);
    const score = tracker.score;
    this.notifyScore(score);
  }

  private notifyScore(score: Score) {
    this.scoreWriter.score(this.serviceId(), score);
    if (score.beats(this.highscore)) {
      this.highscore = Highscore.from(score);
    }
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
