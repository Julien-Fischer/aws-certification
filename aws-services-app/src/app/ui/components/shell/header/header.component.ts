import {Component, ElementRef, HostListener, Inject, inject, Input, signal, ViewChild, effect, computed} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Gamification, gamificationInjectionToken} from "../../../../domain/scoring/gamification";
import {Router} from "@angular/router";
import {SearchService} from "../../../../domain/search/services/search.service";
import {SearchAutocompleteComponent} from "./search-autocomplete/search-autocomplete.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {FlashCardMetadata} from "../../../../domain/search/models/metadata";
import {scoreProviderInjectionToken} from "../../../../domain/scoring/score-provider";
import {FlashCardId} from "../../../../domain/shared/flash-card-id";
import {CompletionBadgeComponent} from "../../generic/completion-badge.component";
import {WaffleIconComponent} from "../../generic/waffle-icon.component";
import {ToggleComponent} from "../../generic/toggle.component";

import {GamificationSettingsMenuComponent} from "./gamification-settings-menu/gamification-settings-menu.component";

const MAX_RESULTS = 10;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchAutocompleteComponent, CompletionBadgeComponent, CompletionBadgeComponent, WaffleIconComponent, GamificationSettingsMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() appName: string = '';
  @Input() logo: string = '';
  @Input() repository: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchTerm = signal('');
  isSearchFocused = signal(false);
  showGamificationOptions = signal(false);
  selectedIndex = signal(-1);
  isMobileMenuOpen = signal(false);

  private router = inject(Router);
  private searchService = inject(SearchService);
  private scoreProvider = inject(scoreProviderInjectionToken);
  themeService = inject(ThemeService);
  gamification = inject<Gamification>(gamificationInjectionToken);

  allMetadata = toSignal(this.searchService.getCardsMatching(''), {initialValue: [] as FlashCardMetadata[]});

  filteredResults = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return [];
    return this.allMetadata().filter(card =>
        card.name.toLowerCase().includes(term) ||
        card.description.toLowerCase().includes(term) ||
        card.category.toLowerCase().includes(term)
    ).slice(0, MAX_RESULTS);
  });

  constructor() {
    effect(() => {
      const term = this.searchTerm();
      this.searchService.setSearchTerm(term);
      this.selectedIndex.set(-1);
      if (term) {
        this.isSearchFocused.set(true);
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }

  onSearchFocus(): void {
    this.isSearchFocused.set(true);
    this.selectedIndex.set(-1);
  }

  onSearchBlur(): void {
    // We use a small timeout to allow click events on the autocomplete results to fire
    // before the menu is hidden by isSearchFocused being set to false
    setTimeout(() => {
      this.isSearchFocused.set(false);
    }, 200);
  }

  async onCardSelected(id: string): Promise<void> {
    this.searchTerm.set('');
    this.isSearchFocused.set(false);
    this.isMobileMenuOpen.set(false);
    await this.router.navigate(['/service', id]);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  @HostListener('window:keydown.control.k', ['$event'])
  handleKeyboardShortcut(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.focusSearch();
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeShortcut(event: any): void {
    this.unfocusSearch();
  }

  private focusSearch(): void {
    if (this.searchInput) {
      const nativeElement = this.searchInput.nativeElement;
      nativeElement.focus();
      nativeElement.select();
    }
  }

  private unfocusSearch(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.blur();
      this.isSearchFocused.set(false);
      this.searchTerm.set('');
      this.selectedIndex.set(-1);
    }
  }

  isComplete(cardId: string): boolean {
    return this.scoreProvider.get(new FlashCardId(cardId)).isMaximum();
  }

  toggleGamificationOptions(event: MouseEvent): void {
    event.stopPropagation();
    this.showGamificationOptions.update(v => !v);
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (this.showGamificationOptions()) {
      const target = event.target as HTMLElement;
      if (!target.closest('.gamification-menu-container') && !target.closest('.gamification-btn')) {
        this.showGamificationOptions.set(false);
      }
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const results = this.filteredResults();
    if (results.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update(i => (i + 1) % results.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(i => (i - 1 + results.length) % results.length);
        break;
      case 'Enter':
      case ' ':
        if (this.selectedIndex() >= 0) {
          event.preventDefault();
          void this.onCardSelected(results[this.selectedIndex()].id);
        }
        break;
    }
  }

}
