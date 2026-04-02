import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { FlashCardService } from '../../../domain/learning/services/flash-card.service';
import {FlashCardMetadata, FlashCardCategory} from '../../../domain/learning/models/metadata';

import { AwsServiceCardComponent } from './aws-service-card/aws-service-card.component';
import Highscore from "../../../domain/scoring/models/highscore";
import {Leaderboard, leaderboardInjectionToken} from "../../../domain/scoring/leaderboard";
import {FlashCardId} from "../../../domain/shared/FlashCardId";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AwsServiceCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  categories!: Observable<FlashCardCategory[]>;

  constructor(
    private flashCardService: FlashCardService,
    @Inject(leaderboardInjectionToken) private leaderBoard: Leaderboard,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.flashCardService.getCategories();
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  protected getHighscore(service: FlashCardMetadata): Highscore {
    return this.leaderBoard.getHighscore(new FlashCardId(service.id));
  }
}