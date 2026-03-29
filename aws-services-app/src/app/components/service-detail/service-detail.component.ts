import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { AwsServicesService } from '../../services/aws-services.service';
import {AwsService, Quiz} from '../../models/aws-service.model';
import { marked } from 'marked';
import { QuizComponent } from '../quiz/quiz.component';
import {MarkdownParserService} from "../../services/markdown-parser.service";

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
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private awsServicesService: AwsServicesService,
    private markdownParser: MarkdownParserService
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

  private loadMarkdownContent(filename: string): void {
    this.awsServicesService.getMarkdownContent(filename).subscribe({
      next: (content) => {
        const { mainContent, trueFalseQuizzes, multipleChoiceQuizzes } = this.markdownParser.parse(content);
        this.markdownContent = marked(mainContent) as string;
        this.trueFalseQuizzes = trueFalseQuizzes;
        this.multipleChoiceQuizzes = multipleChoiceQuizzes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading markdown content:', error);
        this.markdownContent = '<p>Error loading content. Please try again later.</p>';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}