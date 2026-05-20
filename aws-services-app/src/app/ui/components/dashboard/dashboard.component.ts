import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Router } from '@angular/router';
import { SearchService } from '../../../domain/search/services/search.service';
import {FlashCardMetadata, FlashCardCategory} from '../../../domain/search/models/metadata';

import { AwsServiceCardComponent } from './aws-service-card/aws-service-card.component';
import Highscore from "../../../domain/scoring/models/highscore";
import {Leaderboard, leaderboardInjectionToken} from "../../../domain/scoring/leaderboard";
import {FlashCardId} from "../../../domain/shared/flash-card-id";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AwsServiceCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('collapseExpand', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        visibility: 'visible',
        marginBottom: '*'
      })),
      state('collapsed', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden',
        marginBottom: '0',
        overflow: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  categories!: Observable<FlashCardCategory[]>;
  collapsedCategories: Set<string> = new Set<string>();

  constructor(
    private flashCardService: SearchService,
    @Inject(leaderboardInjectionToken) private leaderBoard: Leaderboard,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.flashCardService.getFilteredCategories();
  }

  navigateToService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  protected getHighscore(service: FlashCardMetadata): Highscore {
    return this.leaderBoard.getHighscore(new FlashCardId(service.id));
  }

  toggleCategory(categoryName: string): void {
    if (this.collapsedCategories.has(categoryName)) {
      this.collapsedCategories.delete(categoryName);
    } else {
      this.collapsedCategories.add(categoryName);
    }
  }

  isCollapsed(categoryName: string): boolean {
    return this.collapsedCategories.has(categoryName);
  }
}
