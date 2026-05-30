import { TestBed } from '@angular/core/testing';
import {BehaviorSubject, filter, firstValueFrom} from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchService } from '../services/search.service';
import { flashCardProviderInjectionToken } from '../flash-card-provider';
import {FlashCardCategory, FlashCardMetadata} from '../models/metadata';
import { FlashCard } from '../models/flash-card';
import {FlashCardId} from "../../shared/flash-card-id";
import {MockFlashCardProvider} from "./mock-flashcard-provider";

const aurora = new FlashCardId('aurora');
const cloudtrail = new FlashCardId('cloudtrail');
const dynamoDB = new FlashCardId('dynamoDB');

describe('SearchService', () => {
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

  it('returns all categories when search term is empty even if metadata loads later', async () => {
    // Reset service to control timing
    const provider = new MockFlashCardProvider();
    const mockServices = [
      {
        id: 'ec2',
        name: 'Amazon EC2',
        description: 'Virtual servers',
        icon: 'server',
        category: 'Compute',
        lastUpdated: '2026-01-30'
      }
    ];

    // Create service, but don't resolve getAll immediately
    const getAllSubject = new BehaviorSubject<FlashCardMetadata[]>([]);
    vi.spyOn(provider, 'getAll').mockReturnValue(getAllSubject.asObservable());

    const testService = new SearchService(provider);

    const categoriesPromise = firstValueFrom(testService.getFilteredCategories().pipe(
      filter(cats => cats.length > 0)
    ));

    // Resolve services
    getAllSubject.next(mockServices);

    const categories = await categoriesPromise;
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Compute');
  });

  it('filters categories based on search term', async () => {
    flashCardProvider.havingServices(
      {
        id: 'ec2',
        name: 'Amazon EC2',
        description: 'Virtual servers',
        icon: 'server',
        category: 'Compute',
        lastUpdated: '2026-01-30'
      },
      {
        id: 's3',
        name: 'Amazon S3',
        description: 'Object storage',
        icon: 'storage',
        category: 'Storage',
        lastUpdated: '2026-01-30'
      }
    );

    // Initial state: both categories returned
    let categories = await firstValueFrom(service.getFilteredCategories());
    expect(categories.length).toBe(2);

    // Search for "Compute": only Compute category returned
    service.setSearchTerm('Compute');
    categories = await firstValueFrom(service.getFilteredCategories());
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Compute');

    // Search for "Amazon": both categories returned (matches name)
    service.setSearchTerm('Amazon');
    categories = await firstValueFrom(service.getFilteredCategories());
    expect(categories.length).toBe(2);

    // Search for "object": only Storage category returned (matches description)
    service.setSearchTerm('object');
    categories = await firstValueFrom(service.getFilteredCategories());
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Storage');
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

  describe('fuzzy search', () => {
      it('returns an empty list when no match', async () => {
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

          const categories = await firstValueFrom(service.getCardsMatching('no match'));

          expectMetadata(categories).toBeEmpty();
      })

      it('finds cards by query', async () => {
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

          const categories = await firstValueFrom(service.getCardsMatching('ra'));

          expectMetadata(categories).toBe(['Aurora', 'CloudTrail']);
      })
  })
});


function aFlashCard() {
  return {
    about(content: string) {
      return {
        mainContent: content,
        multipleChoiceQuestions: [],
        booleanQuestions: []
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

function expectMetadata(metadata: FlashCardMetadata[]) {
    return {
        toBe(expected: string[]) {
            const metadataNames = metadata.map(metadata => metadata.name).sort();
            expect(metadataNames).toEqual(expected.sort());
        },
        toBeEmpty() {
            expect(metadata).toHaveLength(0);
        }
    }
}
