import {Component, Inject, inject} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {CommonModule} from "@angular/common";
import {Gamification, gamificationInjectionToken} from "../../../services/gamification";

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
      @Inject(gamificationInjectionToken) gamification: Gamification
  ) {
    this.gamification = gamification;
  }

}
