import { TestBed } from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { AwsServicesService } from '../services/aws-services.service';
import { awsServicesProviderInjectionToken, AwsServicesProvider } from '../aws-service-provider';
import { AwsService } from '../models/aws-service.model';
import { RevisionCard } from '../models/revision-card';

describe('AwsServicesService', () => {
  let service: AwsServicesService;
  let mockProvider: MockServiceProvider;

  class MockServiceProvider implements AwsServicesProvider {

    private services: AwsService[] = [];
    private revisionCards: Map<string, RevisionCard> = new Map();

    havingServices(...services: AwsService[]) {
      this.services.push(...services);
    }

    havingRevisionCard(filename: string, card: RevisionCard) {
      this.revisionCards.set(filename, card);
    }

    getAll(): AwsService[] {
      return this.services;
    }

    getRevisionCards(filename: string): Observable<RevisionCard> {
      return of(this.revisionCards.get(filename)!);
    }
  }

  beforeEach(() => {
    mockProvider = new MockServiceProvider();

    TestBed.configureTestingModule({
      providers: [
        AwsServicesService,
        { provide: awsServicesProviderInjectionToken, useValue: mockProvider }
      ]
    });
    service = TestBed.inject(AwsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
