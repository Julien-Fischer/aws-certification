import {InjectionToken} from "@angular/core";
import {FlashCardMetadata} from "./models/metadata";
import {Observable} from "rxjs";
import {FlashCardId} from "../shared/flash-card-id";

export const carouselInjectionToken = new InjectionToken<Carousel>('Carousel');

export interface Carousel {

  prev(from: FlashCardId): Observable<FlashCardMetadata>;

  next(from: FlashCardId): Observable<FlashCardMetadata>;

}
