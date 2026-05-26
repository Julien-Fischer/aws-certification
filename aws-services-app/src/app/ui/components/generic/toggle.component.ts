import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="toggle-switch"
      [class.checked]="checked()"
      (click)="toggle()"
      [attr.aria-checked]="checked()"
      role="switch"
    >
      <span class="toggle-thumb"></span>
    </button>
  `,
  styles: [`
    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
      background-color: #e9e9ea;
      border-radius: 12px;
      border: 2px solid transparent;
      cursor: pointer;
      transition: background-color 0.2s ease;
      padding: 0;
      outline: none;
      display: inline-block;
      vertical-align: middle;
    }

    .dark .toggle-switch {
      background-color: #39393d;
    }

    .toggle-switch.checked {
      background-color: #34c759;
    }

    .toggle-thumb {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 20px;
      height: 20px;
      background-color: white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease;
    }

    .toggle-switch.checked .toggle-thumb {
      transform: translateX(20px);
    }

    /* Apple-style specific touch: subtle border and shadow for the thumb */
    .toggle-thumb::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      border: 0.5px solid rgba(0, 0, 0, 0.04);
    }
  `]
})
export class ToggleComponent {
  checked = input<boolean>(false);
  changed = output<boolean>();

  toggle() {
    this.changed.emit(!this.checked());
  }
}
