import {Component} from "@angular/core";

@Component({
  selector: 'app-waffle-icon',
  standalone: true,
  template: `
    <div class="waffle-icon">
      <span></span> <span></span> <span></span>
      <span></span> <span></span> <span></span>
      <span></span> <span></span> <span></span>
    </div>
  `,
  styles: [
    `
      .waffle-icon {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px;
        width: 18px;
        height: 18px;
        padding: 2px;

        span {
          width: 4px;
          height: 4px;
          background-color: currentColor;
          border-radius: 50%;
        }
      }
    `
  ],
})
export class WaffleIconComponent {

}
