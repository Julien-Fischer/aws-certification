import {Inject, Injectable} from "@angular/core";
import {Carousel} from "../carousel";
import {FlashCardProvider, flashCardProviderInjectionToken} from "../flash-card-provider";
import {FlashCardId} from "../../shared/flash-card-id";
import {map, Observable, ReplaySubject, switchMap, take, filter} from "rxjs";
import {FlashCardMetadata} from "../models/metadata";

@Injectable({
  providedIn: 'root'
})
export class InMemoryCarousel implements Carousel {

  private cards$ = new ReplaySubject<FlashCardMetadata[]>(1);

  constructor(
    @Inject(flashCardProviderInjectionToken) private flashCardProvider: FlashCardProvider
  ) {
    this.flashCardProvider.getAll()
      .subscribe(cards => {
        this.cards$.next(cards);
      });
  }

  next(from: FlashCardId): Observable<FlashCardMetadata> {
    return this.nextCard(from, 1);
  }

  prev(from: FlashCardId): Observable<FlashCardMetadata> {
    return this.nextCard(from, -1);
  }

  private nextCard(from: FlashCardId, direction: 1 | -1): Observable<FlashCardMetadata> {
    return this.cards$.pipe(
      filter(cards => cards.length > 0),
      take(1),
      map(cards => {
        const currentIndex = cards.findIndex(card => from.hasValue(card.id));
        const length = cards.length;

        let nextIndex = (currentIndex + direction) % length;
        if (nextIndex < 0) {
          nextIndex += length;
        }

        return cards[nextIndex];
      })
    );
  }

}
