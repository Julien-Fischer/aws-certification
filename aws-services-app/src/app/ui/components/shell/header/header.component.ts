import {Component, ElementRef, HostListener, Inject, inject, Input, signal, ViewChild, effect} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";
import {Router} from "@angular/router";
import {SearchService} from "../../../../domain/search/services/search.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() appName: string = '';
  @Input() logo: string = '';
  @Input() repository: string = '';
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchTerm = signal('');

  themeService = inject(ThemeService);

  gamification: Gamification;

  constructor(
      private router: Router,
      private searchService: SearchService,
      @Inject(gamificationInjectionToken) gamification: Gamification
  ) {
    this.gamification = gamification;
    effect(() => {
      this.searchService.setSearchTerm(this.searchTerm());
    });
  }

  goBack(): void {
    void this.router.navigate(['/']);
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
