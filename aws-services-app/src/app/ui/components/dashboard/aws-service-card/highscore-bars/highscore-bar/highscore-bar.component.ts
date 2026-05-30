import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-highscore-bar',
  imports: [],
  template: `
    <div class="flex justify-between text-xs text-[var(--text-secondary)]">
      <span class="mb-2" data-test-id="label">{{ label }}</span>
      <span data-test-id="value">{{ value }}</span>
    </div>

    <div class="w-full bg-[var(--bg-color)] rounded-full h-2 overflow-hidden">
      <div
        data-test-id="bar"
        class="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r"
        [class]="[fromClass, toClass]"
        [style.width]="value"
      ></div>
    </div>
  `,
  styles: [``],
})
export class HighscoreBarComponent {

  @Input() label = '';
  @Input() value = '0%';
  @Input() fromClass = '';
  @Input() toClass = '';

}
