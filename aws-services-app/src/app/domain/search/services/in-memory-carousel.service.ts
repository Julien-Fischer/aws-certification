import {Inject, Injectable} from "@angular/core";
import {Carousel} from "../carousel";
import {FlashCardProvider, flashCardProviderInjectionToken} from "../flash-card-provider";
import {FlashCardId} from "../../shared/flash-card-id";
import {Observable, of} from "rxjs";
import {FlashCardMetadata} from "../models/metadata";

@Injectable({
  providedIn: 'root'
})
export class InMemoryCarousel implements Carousel {

  private cards: FlashCardMetadata[] = [];

  constructor(
    @Inject(flashCardProviderInjectionToken) private flashCardProvider: FlashCardProvider
  ) {
    this.flashCardProvider.getAll()
      .subscribe(cards => this.cards = cards);
  }

  next(from: FlashCardId): Observable<FlashCardMetadata> {
    return this.nextCard(from, 1);
  }

  prev(from: FlashCardId): Observable<FlashCardMetadata> {
    return this.nextCard(from, -1);
  }

  private indexOf(id: FlashCardId): number {
    return this.cards.findIndex(card => id.hasValue(card.id));
  }

  private nextCard(from: FlashCardId, direction: 1 | -1): Observable<FlashCardMetadata> {
    const currentIndex = this.indexOf(from);
    const length = this.cards.length;

    let nextIndex = (currentIndex + direction) % length;
    if (nextIndex < 0) {
      nextIndex += length;
    }

    const nextElement = this.cards[nextIndex];
    return of(nextElement);
  }

}
