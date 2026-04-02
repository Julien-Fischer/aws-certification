import { TestBed } from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { FlashCardService } from '../services/flash-card.service';
import { flashCardProviderInjectionToken, FlashCardProvider } from '../flash-card-provider';
import { FlashCardMetadata } from '../models/aws-service.model';
import { FlashCard } from '../models/flash-card';
import {FlashCardId} from "../../shared/FlashCardId";

class MockFlashCardProvider implements FlashCardProvider {

  private metadata: FlashCardMetadata[] = [];
  private cards: Map<FlashCardId, FlashCard> = new Map();

  havingServices(...services: FlashCardMetadata[]) {
    this.metadata.push(...services);
  }

  havingFlashCard(id: FlashCardId, card: FlashCard) {
    this.cards.set(id, card);
  }

  getAll(): Observable<FlashCardMetadata[]> {
    return of(this.metadata);
  }

  getRevisionCard(id: FlashCardId): Observable<FlashCard> {
    return of(this.cards.get(id)!);
  }

}


describe('FlashCardService', () => {
  let service: FlashCardService;
  let mockProvider: MockFlashCardProvider;

  beforeEach(() => {
    mockProvider = new MockFlashCardProvider();

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
