import { TestBed } from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { AwsServicesService } from '../services/aws-services.service';
import { awsServicesProviderInjectionToken, AwsServicesProvider } from '../aws-service-provider';
import { AwsService } from '../models/aws-service.model';
import { FlashCard } from '../models/flash-card';
import {AwsServiceId} from "../../shared/AwsServiceId";

class MockServiceProvider implements AwsServicesProvider {

  private services: AwsService[] = [];
  private revisionCards: Map<AwsServiceId, FlashCard> = new Map();

  havingServices(...services: AwsService[]) {
    this.services.push(...services);
  }

  havingRevisionCard(id: AwsServiceId, card: FlashCard) {
    this.revisionCards.set(id, card);
  }

  getAll(): Observable<AwsService[]> {
    return of(this.services);
  }

  getRevisionCard(id: AwsServiceId): Observable<FlashCard> {
    return of(this.revisionCards.get(id)!);
  }

}


describe('AwsServicesService', () => {
  let service: AwsServicesService;
  let mockProvider: MockServiceProvider;

  beforeEach(() => {
    mockProvider = new MockServiceProvider();

    TestBed.configureTestingModule({
      providers: [
        AwsServicesService,
        { provide: awsServicesProviderInjectionToken, useValue: mockProvider }
      ]
    });
    service = TestBed.inject(AwsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
