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
import {BehaviorSubject, combineLatest, filter, map, Observable, take} from "rxjs";
import {Gamification, gamificationInjectionToken} from "../../services/gamification";

type MasteryFilter = 'all' | 'mastered' | 'hide-mastered';

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
  masteryFilter$ = new BehaviorSubject<MasteryFilter>('all');

  gamification: Gamification;

  constructor(
    private flashCardService: SearchService,
    @Inject(leaderboardInjectionToken) private leaderBoard: Leaderboard,
    @Inject(gamificationInjectionToken) gamification: Gamification,
    private router: Router
  ) {
    this.gamification = gamification;
  }

  ngOnInit(): void {
    this.categories = combineLatest([
      this.flashCardService.getFilteredCategories(),
      this.masteryFilter$
    ]).pipe(
      map(([categories, filter]) => {
        if (filter === 'all') return categories;

        return categories.map(category => ({
          ...category,
          services: this.filterFlashCards(category, filter)
        })).filter(category => category.services.length > 0);
      })
    );

    if (isMobile()) {
      this.collapseAllCategories();
    }
  }


  private filterFlashCards(category: FlashCardCategory, filter: MasteryFilter): FlashCardMetadata[] {
    return category.services.filter(service => {
      const highscore = this.getHighscore(service);
      const isMastered = highscore.isMaximum();
      return filter === 'mastered' ? isMastered : !isMastered;
    });
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

  toggleAllCategories(): void {
    this.categories.pipe(take(1)).subscribe(categories => {
      const anyCollapsed = categories.some(cat => this.isCollapsed(cat.name));
      if (anyCollapsed) {
        this.collapsedCategories.clear();
      } else {
        categories.forEach(cat => this.collapsedCategories.add(cat.name));
      }
    });
  }

  setMasteryFilter(filter: MasteryFilter): void {
    this.masteryFilter$.next(filter);
  }

  isAllExpanded(): boolean {
    return this.collapsedCategories.size === 0;
  }

  isAnyCollapsed(): boolean {
    return this.collapsedCategories.size > 0;
  }

  private collapseAllCategories() {
    this.categories.pipe(
      filter(categories => categories.length > 0),
      take(1)
    ).subscribe(categories => {
      categories.forEach(cat => this.collapsedCategories.add(cat.name));
    });
  }

}


function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}
