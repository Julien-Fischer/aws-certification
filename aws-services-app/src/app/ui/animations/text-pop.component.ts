import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-text-pop',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div class="highscore-animation-overlay">
        <div class="highscore-text">NEW HIGHSCORE!</div>
      </div>
    }
  `,
  styles: [`
    .highscore-animation-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .highscore-text {
      font-family: 'Courier New', Courier, monospace;
      font-size: 5rem;
      font-weight: 900;
      color: #ffff00;
      text-shadow:
        4px 4px 0 #ff0000,
        -4px -4px 0 #0000ff;
      letter-spacing: 5px;
      animation: punchy-flash 0.4s ease-in-out infinite alternate, zoom-in-out 2s ease-in-out forwards;
      white-space: nowrap;
    }

    @keyframes punchy-flash {
      0% {
        opacity: 1;
        transform: scale(1) rotate(-2deg);
        filter: brightness(1.2);
      }
      100% {
        opacity: 0.8;
        transform: scale(1.1) rotate(2deg);
        filter: brightness(1.5);
      }
    }

    @keyframes zoom-in-out {
      0% {
        transform: translate(-50%, -50%) scale(0) rotate(-20deg);
        opacity: 0;
      }
      15% {
        transform: translate(-0%, -0%) scale(1.2) rotate(5deg);
        opacity: 1;
      }
      85% {
        transform: translate(-0%, -0%) scale(1) rotate(-2deg);
        opacity: 1;
      }
      100% {
        transform: translate(-0%, -0%) scale(2) rotate(10deg);
        opacity: 0;
      }
    }

    @media (max-width: 768px) {
      .highscore-text {
        font-size: 2rem;
      }
    }
  `],
})
export class AppTextPopComponent {
  isVisible = false;

  pop() {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 2000);
  }
}


