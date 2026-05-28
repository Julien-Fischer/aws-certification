import {Inject, Injectable} from "@angular/core";
import {Carousel, carouselInjectionToken} from "../../../domain/search/carousel";
import {FlashCardMetadata} from "../../../domain/search/models/metadata";
import {FlashCardId} from "../../../domain/shared/flash-card-id";
import {forkJoin, map, Observable} from "rxjs";

export interface Neighbor {
  url: string;
  label: string;
}

export interface Neighbors {
  prev: Neighbor;
  next: Neighbor;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {

  constructor(
    @Inject(carouselInjectionToken) private carousel: Carousel
  ) {}

  loadNeighboringCards(id: FlashCardId): Observable<Neighbors> {
    return forkJoin({
      prev: this.carousel.prev(id),
      next: this.carousel.next(id),
    }).pipe(
      map(({ prev, next }) => {
        return {
          prev: toNeighbor(prev),
          next: toNeighbor(next)
        };
      })
    );
  }

}

function toNeighbor(item: FlashCardMetadata) {
  return {url: `/service/${item.id}`, label: item.name};
}
