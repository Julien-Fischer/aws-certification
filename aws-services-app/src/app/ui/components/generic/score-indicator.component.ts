import {Component, Input} from "@angular/core";
import {CircleProgressComponent} from "./circle-progress/circle-progress.component";
import Percentage from "../../../domain/scoring/models/percentage";

@Component({
  selector: 'app-score-indicator',
  standalone: true,
  template: `
    <div class="highscore-indicator p-3 rounded-3 shadow-sm d-flex align-items-center position-relative">
      <div class="indicator-icon-wrapper position-relative me-4">
        <app-circle-progress [percentage]="percentage" [color]="borderColor"></app-circle-progress>
        <div class="
          indicator-icon {{ iconClass }}
          rounded-circle d-flex align-items-center justify-content-center
        ">
          <i class="fas fa-{{ icon }}"></i>
        </div>
      </div>
      <div>
        <div class="indicator-label text-secondary-theme small uppercase fw-bold">
          {{ label }}
        </div>
        <div class="indicator-value h4 mb-0 text-primary-theme">
          {{ value ?? percentage.toFixed(0) }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        flex-grow: 1;
      }
      .highscore-indicator {
        background-color: var(--card-bg);
        border: 1px solid rgba(0, 0, 0, 0.08);
        flex: 1;
        min-width: 180px;
        transition: all 0.2s ease-in-out;
        position: relative;
        overflow: visible;

        :host-context(.dark) & {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .indicator-icon-wrapper {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .indicator-icon {
          width: 42px;
          height: 42px;
          font-size: 1.1rem;
          position: relative;
          z-index: 1;

          &.bg-primary-light {
            background-color: rgba(75, 156, 211, 0.1); /* --aws-light-blue */
          }

          &.bg-success-light {
            background-color: rgba(40, 167, 69, 0.1); /* Success green */
          }

          &.bg-info-light {
            background-color: rgba(23, 162, 184, 0.1); /* Info blue */
          }
        }

        .indicator-label {
          letter-spacing: 0.08em;
          font-size: 0.65rem;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .indicator-value {
          font-weight: 800;
          font-size: 1.5rem;
        }
      }
    `
  ],
  imports: [
    CircleProgressComponent
  ]
})
export class ScoreIndicatorComponent {

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() borderColor: string = '';
  @Input() iconClass: string = '';
  @Input() percentage: Percentage = Percentage.ZERO;
  @Input() value?: string;

}
