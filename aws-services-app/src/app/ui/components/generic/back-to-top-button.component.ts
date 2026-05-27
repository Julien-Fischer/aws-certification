import {Component, HostListener} from "@angular/core";

@Component({
  selector: 'app-back-to-top-button',
  standalone: true,
  template: `
    @if (showButton) {
      <button class="back-to-top" (click)="scrollToTop()" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    }
  `,
  styles: [`
    .back-to-top {
      position: fixed;
      bottom: .75rem;
      right:  .75rem;
      width:  3.5rem;
      height: 3.5rem;
      border-radius: 200px;
      background: rgba(0,0,0,.1);
      color: black;
      backdrop-filter: blur(8px);
      box-shadow:
        0 3px 5px -1px rgba(0, 0, 0, 0.2),
        0 6px 10px 0   rgba(0, 0, 0, 0.14),
        0 1px 18px 0   rgba(0, 0, 0, 0.12) !important;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000;
      transition: .2s;

      &:hover {
        background: rgba(255,255,255,.1) !important;
      }

      :host-context(.dark) & {
        background: rgba(0,0,0,.1);
        color: white;
        &:hover {
          background: rgba(255,255,255,.1);
        }
      }

      i {
        font-size: 1.25rem;
      }

    }


    @media (min-width: 768px) {
      .back-to-top {
        right:  3.5rem;
        bottom: 3.5rem;
      }
    }
  `],
})
export class AppBackToTopButtonComponent {

  showButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 200;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}


