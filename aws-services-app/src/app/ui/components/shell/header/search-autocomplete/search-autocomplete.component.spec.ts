import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchAutocompleteComponent } from './search-autocomplete.component';
import { FlashCardMetadata } from '../../../../../domain/search/models/metadata';

describe('SearchAutocompleteComponent', () => {
  let component: SearchAutocompleteComponent;
  let fixture: ComponentFixture<SearchAutocompleteComponent>;

  const mockResults: FlashCardMetadata[] = [
    {
      id: 'test-1',
      name: 'Test Card 1',
      description: 'Description 1',
      icon: 'icon-1',
      category: 'Cat 1',
      lastUpdated: '2023-01-01'
    },
    {
      id: 'test-2',
      name: 'Test Card 2',
      description: 'Description 2',
      icon: 'icon-2',
      category: 'Cat 2',
      lastUpdated: '2023-01-02'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAutocompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchAutocompleteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display results when provided', () => {
    component.results = mockResults;
    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('li');
    // 2 results
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain('Test Card 1');
    expect(listItems[1].textContent).toContain('Test Card 2');
  });

  it('should emit selected event when a card is clicked', () => {
    const emitSpy = vi.spyOn(component.selected, 'emit');
    component.results = mockResults;
    fixture.detectChanges();

    const firstItem = fixture.nativeElement.querySelector('li');
    firstItem.click();

    expect(emitSpy).toHaveBeenCalledWith('test-1');
  });

  it('should show "No results found" when results are empty', () => {
    component.results = [];
    fixture.detectChanges();

    const listItem = fixture.nativeElement.querySelector('li');
    expect(listItem.textContent).toContain('No results found');
  });

  it('should render icon classes correctly', () => {
    component.results = [mockResults[0]];
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('i');
    expect(icon.className).toContain('icon-1');
  });
});
