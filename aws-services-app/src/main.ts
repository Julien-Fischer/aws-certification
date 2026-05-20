import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/ui/app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/ui/app.routes';
import { provideHttpClient } from '@angular/common/http';
import {FisherYatesShuffler, shufflerInjectionToken} from "./app/ui/services/shuffler";
import {flashCardProviderInjectionToken} from "./app/domain/search/flash-card-provider";
import {MarkdownFlashCardProvider} from "./app/infra/learning/markdown-flash-card-provider.service";
import {SaveHighscore, saveHighscoreInjectionToken} from "./app/domain/scoring/save-highscore";
import {scoreProviderInjectionToken} from "./app/domain/scoring/score-provider";
import {leaderboardInjectionToken} from "./app/domain/scoring/leaderboard";
import {storageInjectionToken} from "./app/domain/scoring/storage";
import LocalStorageAccessor from "./app/infra/scoring/local-storage-accessor";
import {SaveHighscoreService} from "./app/domain/scoring/save-highscore.service";
import {ScoreProviderService} from "./app/domain/scoring/score-provider.service";
import {LeaderBoardService} from "./app/domain/scoring/leaderboard.service";
import {Gamification, gamificationInjectionToken} from "./app/ui/services/gamification";
import {GamificationService} from "./app/ui/services/gamification.service";

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(),
    {
      provide: shufflerInjectionToken,
      useClass: FisherYatesShuffler
    },
    {
      provide: flashCardProviderInjectionToken,
      useClass: MarkdownFlashCardProvider
    },
    {
      provide: leaderboardInjectionToken,
      useClass: LeaderBoardService
    },
    {
      provide: saveHighscoreInjectionToken,
      useClass: SaveHighscoreService
    },
    {
      provide: scoreProviderInjectionToken,
      useClass: ScoreProviderService
    },
    {
      provide: storageInjectionToken,
      useClass: LocalStorageAccessor
    },
    {
      provide: gamificationInjectionToken,
      useClass: GamificationService
    }
  ]
}).catch(err => console.error(err));
