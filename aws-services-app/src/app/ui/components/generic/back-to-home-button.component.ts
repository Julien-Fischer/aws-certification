import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-back-to-home-button',
  standalone: true,
  template: `
    <button class="btn main-button mb-4" (click)="goBack()">
      <i class="fas fa-arrow-left me-2"></i>
      Back to Dashboard
    </button>
  `,
  styles: [``],
})
export class AppBackToHomeButtonComponent {

  constructor(private router: Router) {
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }

}


