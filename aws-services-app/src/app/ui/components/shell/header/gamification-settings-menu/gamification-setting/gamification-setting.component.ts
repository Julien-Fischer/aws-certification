import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from '../../../../generic/toggle.component';

@Component({
  selector: 'app-gamification-setting',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './gamification-setting.component.html',
  styleUrl: './gamification-setting.component.scss'
})
export class GamificationSettingComponent {
  label = input.required<string>();
  isEnabled = input.required<boolean>();
  isChecked = input.required<boolean>();
  toggle = output<void>();

  onToggle(): void {
    if (this.isEnabled()) {
      this.toggle.emit();
    }
  }
}
