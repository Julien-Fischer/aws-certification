import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { AwsServicesService } from '../../../domain/learning/services/aws-services.service';
import { FlashCardMetadata } from '../../../domain/learning/models/aws-service.model';
import { marked } from 'marked';
import { QuizComponent } from '../quiz/quiz.component';
import { Quiz } from '../../../domain/learning/models/quiz';
import { FlashCard } from '../../../domain/learning/models/flash-card';
import Score from '../../../domain/scoring/models/score';
import { ScoreWriter, scoreWriterInjectionToken } from '../../../domain/scoring/score-writer';
import ProgressTracker from './progress-tracker';
import {FlashCardId} from "../../../domain/shared/FlashCardId";

@Component({
  selector: 'app-revision-card',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './revision-card.component.html',
  styleUrl: './revision-card.component.scss',
})
export class RevisionCardComponent implements OnInit {
  service: FlashCardMetadata | undefined;
  markdownContent: string = '';
  trueFalseQuizzes: Quiz[] = [];
  multipleChoiceQuizzes: Quiz[] = [];
  allQuizzes: Quiz[] = [];
  progressTracker = this.trackProgress();

  loading: boolean = true;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private awsServicesService: AwsServicesService,
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
    this.awsServicesService.getMetadata(serviceId).subscribe(
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
    this.awsServicesService.getFlashCard(id).subscribe({
      next: (card: FlashCard) => {
        const { mainContent, trueFalseQuizzes, multipleChoiceQuizzes } = card;
        this.markdownContent = marked(mainContent) as string;
        this.trueFalseQuizzes = trueFalseQuizzes;
        this.multipleChoiceQuizzes = multipleChoiceQuizzes;
        this.allQuizzes = [...this.trueFalseQuizzes, ...this.multipleChoiceQuizzes];
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
    return new ProgressTracker(() => this.allQuizzes.length);
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}