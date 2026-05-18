import {Component, ElementRef, HostListener, Inject, inject, Input, signal, ViewChild, effect, computed} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";
import {Router} from "@angular/router";
import {SearchService} from "../../../../domain/search/services/search.service";
import {SearchAutocompleteComponent} from "./search-autocomplete/search-autocomplete.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {FlashCardMetadata} from "../../../../domain/search/models/metadata";

const MAX_RESULTS = 10;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchAutocompleteComponent],
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

  private router = inject(Router);
  private searchService = inject(SearchService);
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
      this.searchService.setSearchTerm(this.searchTerm());
    });
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }

  onSearchFocus(): void {
    this.isSearchFocused.set(true);
  }

  async onCardSelected(id: string): Promise<void> {
    this.searchTerm.set('');
    this.isSearchFocused.set(false);
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
    }
  }

}
