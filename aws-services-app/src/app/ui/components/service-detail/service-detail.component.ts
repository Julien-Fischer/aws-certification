import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { AwsServicesService } from '../../../domain/learning/services/aws-services.service';
import { AwsService } from '../../../domain/learning/models/aws-service.model';
import { marked } from 'marked';
import { QuizComponent } from '../quiz/quiz.component';
import { Quiz } from '../../../domain/learning/models/quiz';
import { RevisionCard } from '../../../domain/learning/models/revision-card';
import Score from '../../../domain/scoring/models/score';
import { ScoreWriter, scoreWriterInjectionToken } from '../../../domain/scoring/score-writer';
import ProgressTracker from './progress-tracker';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent implements OnInit {
  service: AwsService | undefined;
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
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadService(serviceId);
    } else {
      this.loading = false;
    }
  }

  private loadService(serviceId: string): void {
    this.awsServicesService.getServiceById(serviceId).subscribe(
        service => {
          this.service = service;
          if (service) {
            this.loadMarkdownContent(service.markdownFile);
          } else {
            this.loading = false;
          }
        }
    );
  }

  private loadMarkdownContent(serviceName: string): void {
    this.awsServicesService.getRevisionCards(serviceName).subscribe({
      next: (page: RevisionCard) => {
        const { mainContent, trueFalseQuizzes, multipleChoiceQuizzes } = page;
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
    this.scoreWriter.score(this.service!.id, score);
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