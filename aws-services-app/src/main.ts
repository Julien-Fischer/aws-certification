import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/ui/app.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/ui/app.routes';
import { provideHttpClient } from '@angular/common/http';
import {FisherYatesShuffler, shufflerInjectionToken} from "./app/ui/services/shuffler";
import {flashCardProviderInjectionToken} from "./app/domain/search/flash-card-provider";
import {MarkdownFlashCardProvider} from "./app/infra/learning/markdown-flash-card-provider.service";
import {HighscoreEvaluator, saveHighscoreInjectionToken} from "./app/domain/scoring/highscore-evaluator";
import {scoreProviderInjectionToken} from "./app/domain/scoring/score-provider";
import {leaderboardInjectionToken} from "./app/domain/scoring/leaderboard";
import {storageInjectionToken} from "./app/domain/scoring/storage";
import HighscoreLocalStorageAccessor from "./app/infra/scoring/highscore-local-storage-accessor";
import {SaveHighscoreService} from "./app/domain/scoring/save-highscore.service";
import {ScoreProviderService} from "./app/domain/scoring/score-provider.service";
import {LeaderBoardService} from "./app/domain/scoring/leaderboard.service";
import {Gamification, gamificationInjectionToken} from "./app/domain/scoring/gamification";
import {GamificationService} from "./app/ui/services/gamification.service";
import {carouselInjectionToken} from "./app/domain/search/carousel";
import {InMemoryCarousel} from "./app/domain/search/services/in-memory-carousel.service";
import {ForgetHighscoreService} from "./app/domain/scoring/forget-highscore.service";
import {forgetHighscoreInjectionToken} from "./app/domain/scoring/highscore-eraser";
import GamificationLocalStorageAccessor, {GAMIFICATION_STORAGE} from "./app/infra/scoring/gamification-local-storage-accessor";
import {startQuizInjectionToken} from "./app/domain/training/ports/inbound/start-quiz";
import {QuizPublisher} from "./app/infra/training/quiz-publisher.service";

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
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
      provide: forgetHighscoreInjectionToken,
      useClass: ForgetHighscoreService
    },
    {
      provide: scoreProviderInjectionToken,
      useClass: ScoreProviderService
    },
    {
      provide: storageInjectionToken,
      useClass: HighscoreLocalStorageAccessor
    },
    {
      provide: GAMIFICATION_STORAGE,
      useClass: GamificationLocalStorageAccessor,
    },
    {
      provide: gamificationInjectionToken,
      useClass: GamificationService
    },
    {
      provide: carouselInjectionToken,
      useClass: InMemoryCarousel
    },
    {
      provide: startQuizInjectionToken,
      useClass: QuizPublisher
    }
  ]
}).catch(err => console.error(err));
