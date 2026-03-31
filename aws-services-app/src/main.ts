import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/ui/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/ui/app.routes';
import { provideHttpClient } from '@angular/common/http';
import {FisherYatesShuffler, shufflerInjectionToken} from "./app/ui/services/shuffler";
import {awsServicesProviderInjectionToken} from "./app/domain/learning/aws-service-provider";
import {InMemoryAwsServicesProvider} from "./app/infra/learning/in-memory-aws-services-provider";
import {scoreWriterInjectionToken} from "./app/domain/scoring/score-writer";
import {leaderboardInjectionToken} from "./app/domain/scoring/leaderboard";
import {storageInjectionToken} from "./app/domain/scoring/storage";
import LocalStorageAccessor from "./app/infra/scoring/local-storage-accessor";
import {ScoreWriterService} from "./app/domain/scoring/score-writer.service";
import {LeaderBoardService} from "./app/domain/scoring/leaderboard.service";
import {Gamification, gamificationInjectionToken} from "./app/ui/services/gamification";
import {GamificationService} from "./app/ui/services/gamification.service";

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideRouter(routes),
    provideHttpClient(),
    {
      provide: shufflerInjectionToken,
      useClass: FisherYatesShuffler
    },
    {
      provide: awsServicesProviderInjectionToken,
      useClass: InMemoryAwsServicesProvider
    },
    {
      provide: leaderboardInjectionToken,
      useClass: LeaderBoardService
    },
    {
      provide: scoreWriterInjectionToken,
      useClass: ScoreWriterService
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