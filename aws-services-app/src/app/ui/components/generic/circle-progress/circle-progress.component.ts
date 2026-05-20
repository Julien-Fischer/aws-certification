import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import Percentage from "../../../../domain/scoring/models/percentage";

@Component({
  selector: 'app-circle-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg class="circle-progress-svg" [attr.viewBox]="'0 0 ' + size + ' ' + size">
      <circle
        class="progress-circle"
        [attr.cx]="size / 2"
        [attr.cy]="size / 2"
        [attr.r]="radius"
        [attr.stroke]="color"
        [attr.stroke-width]="strokeWidth"
        fill="none"
        [style.stroke-dasharray]="circumference"
        [style.stroke-dashoffset]="strokeDashoffset"
      />
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      display: block;
      width: 46px; /* 42px + 2px stroke * 2 */
      height: 46px;
    }

    .circle-progress-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
      transform: rotate(-90deg); /* Start at top */
    }

    .progress-circle {
      transition: stroke-dashoffset 0.8s ease-out;
      stroke-linecap: round;
    }
  `]
})
export class CircleProgressComponent implements OnChanges {
  @Input() percentage: Percentage = Percentage.ZERO;
  @Input() color: string = 'blue';
  @Input() size: number = 46;
  @Input() strokeWidth: number = 2;

  radius: number = 0;
  circumference: number = 0;
  strokeDashoffset: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.updateProgress();
  }

  private updateProgress(): void {
    this.radius = (this.size - this.strokeWidth) / 2;
    this.circumference = 2 * Math.PI * this.radius;

    const ratio = this.percentage.toRatio();
    this.strokeDashoffset = this.circumference - (this.circumference * ratio.value);
  }
}
