import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleComponent } from '../toggle.component';

@Component({
  selector: 'app-gamification-setting',
  standalone: true,
  imports: [CommonModule, ToggleComponent],
  templateUrl: './switch-button.component.html',
  styleUrl: './switch-button.component.scss'
})
export class SwitchButtonComponent {
  label = input.required<string>();
  isEnabled = input<boolean>(true);
  isChecked = input.required<boolean>();
  toggle = output<void>();

  onToggle(): void {
    if (this.isEnabled()) {
      this.toggle.emit();
    }
  }
}
