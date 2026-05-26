import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Gamification, gamificationInjectionToken } from "../../../../services/gamification";
import { forgetHighscoreInjectionToken } from "../../../../../domain/scoring/highscore-eraser";
import {ToggleComponent} from "../../../generic/toggle.component";

@Component({
  selector: 'app-gamification-settings-menu',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './gamification-settings-menu.component.html',
  styleUrl: './gamification-settings-menu.component.scss'
})
export class GamificationSettingsMenuComponent {
  gamification = inject<Gamification>(gamificationInjectionToken);
  private highscoreEraser = inject(forgetHighscoreInjectionToken);

  close = output<void>();

  forgetAll(): void {
    if (confirm('Are you sure you want to reset all highscores? This action cannot be undone.')) {
      this.highscoreEraser.forgetAll();
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
