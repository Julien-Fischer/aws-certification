import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, of} from 'rxjs';
import { FlashCardMetadata, ServiceCategory } from '../models/aws-service.model';
import {AwsServicesProvider, awsServicesProviderInjectionToken} from "../aws-service-provider";
import {FlashCard} from "../models/flash-card";
import {FlashCardId} from "../../shared/FlashCardId";

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  private servicesSubject = new BehaviorSubject<FlashCardMetadata[]>([]);

  constructor(
      @Inject(awsServicesProviderInjectionToken) private awsServicesProvider: AwsServicesProvider,
  ) {
    this.awsServicesProvider.getAll().subscribe(services => {
      this.servicesSubject.next(services);
    });
  }

  getMetadata(id: FlashCardId): Observable<FlashCardMetadata | undefined> {
    return this.servicesSubject.pipe(
        map(services => services.find(s => id.hasValue(s.id))
    ));
  }

  getFlashCard(id: FlashCardId): Observable<FlashCard> {
    return this.awsServicesProvider.getRevisionCard(id)
  }

  getServiceCategories(): Observable<ServiceCategory[]> {
    return this.servicesSubject.pipe(
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
