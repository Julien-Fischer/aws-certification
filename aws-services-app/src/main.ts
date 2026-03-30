import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/ui/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/ui/app.routes';
import { provideHttpClient } from '@angular/common/http';
import {FisherYatesShuffler, shufflerInjectionToken} from "./app/ui/services/shuffler";
import {awsServicesProviderInjectionToken} from "./app/domain/learning/aws-service-provider";
import {InMemoryAwsServicesProvider} from "./app/infra/in-memory-aws-services-provider";

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
    }
  ]
}).catch(err => console.error(err));