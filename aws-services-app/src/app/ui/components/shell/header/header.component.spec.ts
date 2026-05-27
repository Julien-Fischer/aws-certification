import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { HeaderComponent } from './header.component';
import {GamificationService} from "../../../services/gamification.service";
import {provideGamification} from "../../../test/stub-gamification";
import {flashCardProviderInjectionToken} from "../../../../domain/search/flash-card-provider";
import {MockFlashCardProvider} from "../../../../domain/search/test/mock-flashcard-provider";
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SearchService } from '../../../../domain/search/services/search.service';
import {scoreProviderInjectionToken} from "../../../../domain/scoring/score-provider";
import Highscore from "../../../../domain/scoring/models/highscore";
import {forgetHighscoreInjectionToken} from "../../../../domain/scoring/highscore-eraser";
import {ForgetHighscoreService} from "../../../../domain/scoring/forget-highscore.service";
import HighscoreInMemoryStorage from "../../../../domain/scoring/test/utils/highscore-in-memory-storage";
import {storageInjectionToken} from "../../../../domain/scoring/storage";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });

    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
          provideRouter([]),
          provideGamification(),
          { provide: flashCardProviderInjectionToken, useClass: MockFlashCardProvider },
          { provide: storageInjectionToken, useClass: HighscoreInMemoryStorage },
          { provide: forgetHighscoreInjectionToken, useClass: ForgetHighscoreService },
          {
            provide: scoreProviderInjectionToken,
            useValue: {
              get: vi.fn().mockReturnValue(Highscore.NONE)
            }
          }
      ]
    });
    // Use compileComponents to resolve external templates/styles
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear search term when clearSearch is called', () => {
    component.searchTerm.set('test');
    component.clearSearch();
    expect(component.searchTerm()).toBe('');
  });

  it('should update search term when signal is updated', () => {
    component.searchTerm.set('aws');
    expect(component.searchTerm()).toBe('aws');
  });

  it('should focus and select search input when CTRL+/ is pressed', () => {
    const focusSpy = vi.spyOn(component['searchInput'].nativeElement, 'focus');
    const selectSpy = vi.spyOn(component['searchInput'].nativeElement, 'select');

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    });
    window.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });

  it('should blur search input, hide autocomplete and clear search term when Escape key is pressed', () => {
    const blurSpy = vi.spyOn(component['searchInput'].nativeElement, 'blur');
    component.isSearchFocused.set(true);
    component.searchTerm.set('test');

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    window.dispatchEvent(event);

    expect(blurSpy).toHaveBeenCalled();
    expect(component.isSearchFocused()).toBe(false);
    expect(component.searchTerm()).toBe('');
  });
});
