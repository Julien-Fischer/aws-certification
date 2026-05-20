import {Component} from "@angular/core";

@Component({
  selector: 'app-completion-badge',
  standalone: true,
  template: `
    <div class="completion-badge">
      <i class="fas fa-check"></i>
    </div>
  `,
  styles: [
    `
      .completion-badge {
        position: absolute;
        top: 6px;
        right: 6px;
        background-color: #22c55e; // text-green-500 equivalent
        color: white;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    `
  ],
})
export class CompletionBadgeComponent {

}
