import { TestBed } from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { FlashCardService } from '../services/flash-card.service';
import { flashCardProviderInjectionToken, FlashCardProvider } from '../aws-service-provider';
import { FlashCardMetadata } from '../models/aws-service.model';
import { FlashCard } from '../models/flash-card';
import {FlashCardId} from "../../shared/FlashCardId";

class MockServiceProvider implements FlashCardProvider {

  private services: FlashCardMetadata[] = [];
  private revisionCards: Map<FlashCardId, FlashCard> = new Map();

  havingServices(...services: FlashCardMetadata[]) {
    this.services.push(...services);
  }

  havingFlashCard(id: FlashCardId, card: FlashCard) {
    this.revisionCards.set(id, card);
  }

  getAll(): Observable<FlashCardMetadata[]> {
    return of(this.services);
  }

  getRevisionCard(id: FlashCardId): Observable<FlashCard> {
    return of(this.revisionCards.get(id)!);
  }

}


describe('FlashCardService', () => {
  let service: FlashCardService;
  let mockProvider: MockServiceProvider;

  beforeEach(() => {
    mockProvider = new MockServiceProvider();

    TestBed.configureTestingModule({
      providers: [
        FlashCardService,
        { provide: flashCardProviderInjectionToken, useValue: mockProvider }
      ]
    });
    service = TestBed.inject(FlashCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
