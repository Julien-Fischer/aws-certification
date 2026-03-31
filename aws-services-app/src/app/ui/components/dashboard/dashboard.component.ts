import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { AwsServicesService } from '../../../domain/learning/services/aws-services.service';
import {AwsService, ServiceCategory} from '../../../domain/learning/models/aws-service.model';

import { AwsServiceCardComponent } from './aws-service-card/aws-service-card.component';
import Highscore from "../../../domain/scoring/models/highscore";
import {Leaderboard, leaderboardInjectionToken} from "../../../domain/scoring/leaderboard";
import {AwsServiceId} from "../../../domain/shared/AwsServiceId";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AwsServiceCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  categories: ServiceCategory[] = [];

  constructor(
    private awsServicesService: AwsServicesService,
    @Inject(leaderboardInjectionToken) private leaderBoard: Leaderboard,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.awsServicesService.getServiceCategories().subscribe(
      categories => this.categories = categories
    );
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  protected getHighscore(service: AwsService): Highscore {
    return this.leaderBoard.getHighscore(new AwsServiceId(service.id));
  }
}