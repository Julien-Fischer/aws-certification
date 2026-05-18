import {Component, ElementRef, HostListener, Inject, inject, Input, signal, ViewChild} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";
import {Router} from "@angular/router";

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
      @Inject(gamificationInjectionToken) gamification: Gamification
  ) {
    this.gamification = gamification;
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

  private focusSearch(): void {
    if (this.searchInput) {
      const nativeElement = this.searchInput.nativeElement;
      nativeElement.focus();
      nativeElement.select();
    }
  }

}
