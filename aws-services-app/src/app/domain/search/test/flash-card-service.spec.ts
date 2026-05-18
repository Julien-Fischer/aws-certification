import { TestBed } from '@angular/core/testing';
import {firstValueFrom, Observable, of} from 'rxjs';
import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { SearchService } from '../services/search.service';
import { flashCardProviderInjectionToken, FlashCardProvider } from '../flash-card-provider';
import {FlashCardCategory, FlashCardMetadata} from '../models/metadata';
import { FlashCard } from '../models/flash-card';
import {FlashCardId} from "../../shared/flash-card-id";

class MockFlashCardProvider implements FlashCardProvider {

  private metadata: FlashCardMetadata[] = [];
  private cards: Map<FlashCardId, FlashCard> = new Map();

  havingServices(...services: FlashCardMetadata[]) {
    this.metadata.push(...services);
  }

  havingFlashCard(id: FlashCardId, card: FlashCard) {
    this.cards.set(id, card);
  }

  getAll(): Observable<FlashCardMetadata[]> {
    return of(this.metadata);
  }

  getCard(id: FlashCardId): Observable<FlashCard> {
    return of(this.cards.get(id)!);
  }

}

const aurora = new FlashCardId('aurora');
const cloudtrail = new FlashCardId('cloudtrail');
const dynamoDB = new FlashCardId('dynamoDB');


describe('FlashCardService', () => {
  let service: SearchService;
  let flashCardProvider: MockFlashCardProvider;

  beforeEach(() => {
    flashCardProvider = new MockFlashCardProvider();

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: flashCardProviderInjectionToken, useValue: flashCardProvider }
      ]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns metadata for specified ID', async () => {
    flashCardProvider.havingServices(
        {
          id: 'cloudtrail',
          name: 'CloudTrail',
          description: 'CloudTrail description.',
          icon: 'cloud',
          category: 'Cloud',
          lastUpdated: '2026-01-30'
        },
        {
          id: 'aurora',
          name: 'Aurora',
          description: 'Aurora description.',
          icon: 'database',
          category: 'Database',
          lastUpdated: '2026-01-31'
        }
    );
    flashCardProvider.havingFlashCard(cloudtrail, aFlashCard().about('cloudtrail'));
    flashCardProvider.havingFlashCard(aurora, aFlashCard().about('aurora'));

    const cloudtrailMetadata = await firstValueFrom(service.getMetadata(cloudtrail));
    const auroraMetadata = await firstValueFrom(service.getMetadata(aurora));

    expect(cloudtrailMetadata).toEqual({
      id: 'cloudtrail',
      name: 'CloudTrail',
      description: 'CloudTrail description.',
      icon: 'cloud',
      category: 'Cloud',
      lastUpdated: '2026-01-30'
    });
    expect(auroraMetadata).toEqual({
      id: 'aurora',
      name: 'Aurora',
      description: 'Aurora description.',
      icon: 'database',
      category: 'Database',
      lastUpdated: '2026-01-31'
    });
  });

  it('returns flashcard for specified id', async () => {
    flashCardProvider.havingServices(
        {
          id: 'cloudtrail',
          name: 'CloudTrail',
          description: 'CloudTrail description.',
          icon: 'cloud',
          category: 'Cloud',
          lastUpdated: '2026-01-30'
        }
    );
    flashCardProvider.havingFlashCard(aurora, aFlashCard().about('aurora'));
    flashCardProvider.havingFlashCard(cloudtrail, aFlashCard().about('cloudtrail'));

    const auroraCard = await firstValueFrom(service.getFlashCard(aurora));
    const cloudtrailCard = await firstValueFrom(service.getFlashCard(cloudtrail));

    expectCard(auroraCard).toHaveContent('aurora');
    expectCard(cloudtrailCard).toHaveContent('cloudtrail');
  });

  it('returns aggregated list of categories', async () => {
    flashCardProvider.havingServices(
        {
          id: 'cloudtrail',
          name: 'CloudTrail',
          description: 'CloudTrail description.',
          icon: 'cloud',
          category: 'Cloud',
          lastUpdated: '2026-01-30'
        },
        {
          id: 'aurora',
          name: 'Aurora',
          description: 'Aurora description.',
          icon: 'database',
          category: 'Database',
          lastUpdated: '2026-01-30'
        },
        {
          id: 'dynamoDB',
          name: 'DynamoDB',
          description: 'DynamoDB description.',
          icon: 'database',
          category: 'Database',
          lastUpdated: '2026-01-30'
        }
    );
    flashCardProvider.havingFlashCard(aurora, aFlashCard().about('aurora'));
    flashCardProvider.havingFlashCard(cloudtrail, aFlashCard().about('cloudtrail'));
    flashCardProvider.havingFlashCard(dynamoDB, aFlashCard().about('dynamoDB'));

    const categories = await firstValueFrom(service.getCategories());

    expectCategories(categories).toBe(['Cloud', 'Database']);
  });
});


function aFlashCard() {
  return {
    about(content: string) {
      return {
        mainContent: content,
        multipleChoiceQuestions: [],
        trueFalseQuestions: []
      }
    }
  }
}

function expectCard(flashCard: FlashCard) {
  return {
    toHaveContent(content: string) {
      expect(flashCard.mainContent).toBe(content);
    }
  }
}

function expectCategories(categories: FlashCardCategory[]) {
  const categoryNames = categories.map(category => category.name).sort();

  return {
    toBe(expected: string[]) {
      expect(categoryNames).toEqual(expected.sort());
    }
  };
}
