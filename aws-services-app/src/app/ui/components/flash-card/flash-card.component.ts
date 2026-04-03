import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { FlashCardService } from '../../../domain/learning/services/flash-card.service';
import { FlashCardMetadata } from '../../../domain/learning/models/metadata';
import { marked } from 'marked';
import { QuizComponent } from '../quiz/quiz.component';
import { Question } from '../../../domain/learning/models/question';
import { FlashCard } from '../../../domain/learning/models/flash-card';
import Score from '../../../domain/scoring/models/score';
import { ScoreWriter, scoreWriterInjectionToken } from '../../../domain/scoring/score-writer';
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

  loading: boolean = true;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private flashCardService: FlashCardService,
      @Inject(scoreWriterInjectionToken) private scoreWriter: ScoreWriter
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