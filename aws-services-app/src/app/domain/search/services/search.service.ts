import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import { FlashCardMetadata, FlashCardCategory } from '../models/metadata';
import {FlashCardProvider, flashCardProviderInjectionToken} from "../flash-card-provider";
import {FlashCard} from "../models/flash-card";
import {FlashCardId} from "../../shared/flash-card-id";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private allMetadata = new BehaviorSubject<FlashCardMetadata[] | null>(null);
  private _searchTerm = new BehaviorSubject<string>('');

  constructor(
      @Inject(flashCardProviderInjectionToken) private flashCardProvider: FlashCardProvider,
  ) {
    this.flashCardProvider.getAll().subscribe(services => {
      this.allMetadata.next(services);
    });
  }

  setSearchTerm(term: string): void {
    this._searchTerm.next(term);
  }

  getMetadata(id: FlashCardId): Observable<FlashCardMetadata | undefined | null> {
    return this.allMetadata.pipe(
        map(services => {
          if (services === null) {
            return null;
          }
          return services.find(s => id.hasValue(s.id));
        }
    ));
  }

  getFlashCard(id: FlashCardId): Observable<FlashCard> {
    return this.flashCardProvider.getCard(id)
  }

  getCategories(): Observable<FlashCardCategory[]> {
    return this.allMetadata.pipe(
        map(services => services ?? []),
        map(services => this.toCategories(services))
    );
  }

  getFilteredCategories(): Observable<FlashCardCategory[]> {
    return combineLatest([this.allMetadata, this._searchTerm]).pipe(
      map(([allMetadata, query]) => {
        const services = allMetadata ?? [];
        const lowerQuery = query.toLowerCase();
        return services.filter(card =>
          card.name.toLowerCase().includes(lowerQuery) ||
          card.description.toLowerCase().includes(lowerQuery) ||
          card.category.toLowerCase().includes(lowerQuery)
        );
      }),
      map(filteredServices => this.toCategories(filteredServices))
    );
  }

  getCardsMatching(query: string): Observable<FlashCardMetadata[]> {
    const lowerQuery = query.toLowerCase();
    return this.flashCardProvider.getAll().pipe(
      map(cards => cards.filter(card =>
        card.name.toLowerCase().includes(lowerQuery) ||
        card.description.toLowerCase().includes(lowerQuery) ||
        card.category.toLowerCase().includes(lowerQuery)
      ))
    );
  }

  private toCategories(services: FlashCardMetadata[]): FlashCardCategory[] {
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
  }

}
