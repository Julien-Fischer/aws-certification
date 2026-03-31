import {Component, Inject, inject} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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

}
