import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import { FlashCardMetadata, FlashCardCategory } from '../models/aws-service.model';
import {FlashCardProvider, flashCardProviderInjectionToken} from "../flash-card-provider";
import {FlashCard} from "../models/flash-card";
import {FlashCardId} from "../../shared/FlashCardId";

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  private metadataSubject = new BehaviorSubject<FlashCardMetadata[]>([]);

  constructor(
      @Inject(flashCardProviderInjectionToken) private flashCardProvider: FlashCardProvider,
  ) {
    this.flashCardProvider.getAll().subscribe(services => {
      this.metadataSubject.next(services);
    });
  }

  getMetadata(id: FlashCardId): Observable<FlashCardMetadata | undefined> {
    return this.metadataSubject.pipe(
        map(services => services.find(s => id.hasValue(s.id))
    ));
  }

  getFlashCard(id: FlashCardId): Observable<FlashCard> {
    return this.flashCardProvider.getCard(id)
  }

  getCategories(): Observable<FlashCardCategory[]> {
    return this.metadataSubject.pipe(
        map(services => {
          const categoryMap = services.reduce((map, service) => {
            const category = service.category;
            const list = map.get(category) ?? [];
            map.set(category, [...list, service]);
            return map;
          }, new Map<string, FlashCardMetadata[]>());
          return Array.from(categoryMap.entries()).map(([name, services]) => ({
            name,
            services
          }));
        })
    );
  }

}
