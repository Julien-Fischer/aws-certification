import {describe, it, expect, beforeEach} from "vitest";
import {MockFlashCardProvider} from "./mock-flashcard-provider";
import {TestBed} from "@angular/core/testing";
import {flashCardProviderInjectionToken} from "../flash-card-provider";
import {InMemoryCarousel} from "../services/in-memory-carousel.service";
import {FlashCardMetadata} from "../models/metadata";
import {FlashCardId} from "../../shared/flash-card-id";

const first = {
  id: 'aurora',
  name: 'Aurora',
  description: 'Aurora description.',
  icon: 'database',
  category: 'Database',
  lastUpdated: '2026-01-31'
};
const last = {
  id: 'ec2',
  name: 'Amazon EC2',
  description: 'Virtual servers',
  icon: 'server',
  category: 'Compute',
  lastUpdated: '2026-01-30'
};

describe('InMemoryCarouselService', () => {

  let carousel: InMemoryCarousel;
  let flashCardProvider: MockFlashCardProvider;

  beforeEach(() => {
    flashCardProvider = new MockFlashCardProvider();

    TestBed.configureTestingModule({
      providers: [
        InMemoryCarousel,
        { provide: flashCardProviderInjectionToken, useValue: flashCardProvider }
      ]
    });
    carousel = TestBed.inject(InMemoryCarousel);
  });

  it('should be created', () => {
    expect(carousel).toBeTruthy();
  });

  it('returns next card', async () => {
    havingCards(first, last);

    carousel.next(id(first))
      .subscribe(next => expectCard(next).toBe(last));
  })

  it('returns previous card', async () => {
    havingCards(first, last);

    carousel.prev(id(last))
      .subscribe(next => expectCard(next).toBe(first));
  })

  it('returns first card when current is last', async () => {
    havingCards(first, last);

    carousel.next(id(last))
      .subscribe(next => expectCard(next).toBe(first));
  })


  function havingCards(...cards: FlashCardMetadata[]) {
    flashCardProvider.havingServices(...cards);
  }

})

function id(card: FlashCardMetadata) {
  return new FlashCardId(card.id);
}

function expectCard(card: FlashCardMetadata) {
  return {
    toBe(metadata: FlashCardMetadata) {
      expect(card.id).toBe(metadata.id);
    }
  }
}
