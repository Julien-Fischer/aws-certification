import { TestBed } from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { AwsServicesService } from '../services/aws-services.service';
import { awsServicesProviderInjectionToken, AwsServicesProvider } from '../aws-service-provider';
import { AwsService } from '../models/aws-service.model';
import { FlashCard } from '../models/flash-card';
import {FlashCardId} from "../../shared/FlashCardId";

class MockServiceProvider implements AwsServicesProvider {

  private services: AwsService[] = [];
  private revisionCards: Map<FlashCardId, FlashCard> = new Map();

  havingServices(...services: AwsService[]) {
    this.services.push(...services);
  }

  havingRevisionCard(id: FlashCardId, card: FlashCard) {
    this.revisionCards.set(id, card);
  }

  getAll(): Observable<AwsService[]> {
    return of(this.services);
  }

  getRevisionCard(id: FlashCardId): Observable<FlashCard> {
    return of(this.revisionCards.get(id)!);
  }

}


describe('AwsServicesService', () => {
  let service: AwsServicesService;
  let mockProvider: MockServiceProvider;

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
