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

  it('returns next card even if data is loaded late', async () => {
    carousel.next(id(first))
      .subscribe(next => expectCard(next).toBe(last));

    havingCards(first, last);
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

  it('returns last card when current is first', async () => {
    havingCards(first, last);

    carousel.prev(id(first))
      .subscribe(next => expectCard(next).toBe(last));
  })

  it('returns same card when only one card', async () => {
    const onlyCard = first;
    havingCards(onlyCard);

    carousel.prev(id(onlyCard))
      .subscribe(next => expectCard(next).toBe(onlyCard));

    carousel.next(id(onlyCard))
      .subscribe(next => expectCard(next).toBe(onlyCard));
  })

  it('cycles forward', async () => {
    havingCards(first, last);

    carousel.next(id(last))
      .subscribe(next => expectCard(next).toBe(first));

    carousel.next(id(first))
      .subscribe(next => expectCard(next).toBe(last));

    carousel.next(id(last))
      .subscribe(next => expectCard(next).toBe(first));
  })

  it('cycles backward', async () => {
    havingCards(first, last);

    carousel.prev(id(first))
      .subscribe(next => expectCard(next).toBe(last));

    carousel.prev(id(last))
      .subscribe(next => expectCard(next).toBe(first));

    carousel.prev(id(first))
      .subscribe(next => expectCard(next).toBe(last));
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
