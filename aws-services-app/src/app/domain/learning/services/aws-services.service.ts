import {Inject, Injectable} from '@angular/core';
import { Observable, of} from 'rxjs';
import { AwsService, ServiceCategory } from '../models/aws-service.model';
import {AwsServicesProvider, awsServicesProviderInjectionToken} from "../aws-service-provider";
import {RevisionCard} from "../models/revision-card";
import {AwsServiceId} from "../../shared/AwsServiceId";

@Injectable({
  providedIn: 'root'
})
export class AwsServicesService {

  private readonly services: AwsService[] = [];

  constructor(
      @Inject(awsServicesProviderInjectionToken) private awsServicesProvider: AwsServicesProvider,
  ) {
    this.services.push(...this.awsServicesProvider.getAll());
  }

  getServiceById(id: AwsServiceId): Observable<AwsService | undefined> {
    const service = this.services.find(s => id.hasValue(s.id));
    return of(service);
  }

  getRevisionCards(id: AwsServiceId): Observable<RevisionCard> {
    return this.awsServicesProvider.getRevisionCards(id)
  }

  getServiceCategories(): Observable<ServiceCategory[]> {
    const categoryMap = this.groupServicesByCategory();
    const categories = this.toCategoriesArray(categoryMap);
    return of(categories);
  }

  private groupServicesByCategory(): Map<string, AwsService[]> {
    return Array.from(this.services)
        .reduce((map, service) => {
          const category = service.category;
          const list = map.get(category) ?? [];
          map.set(category, [...list, service]);
          return map;
        }, new Map<string, AwsService[]>());
  }

  private toCategoriesArray(categoryMap: Map<string, AwsService[]>): ServiceCategory[] {
    return Array.from(categoryMap.entries()).map(([name, services]) => ({
      name,
      services
    }));
  }

}
