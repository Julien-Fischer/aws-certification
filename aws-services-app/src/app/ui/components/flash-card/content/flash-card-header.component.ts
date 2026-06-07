import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashCardMetadata } from '../../../../domain/search/models/metadata';

@Component({
  selector: 'app-flash-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-header bg-transparent border-0 pt-4 pb-3">
      <div class="d-flex align-items-center justify-content-between border-b border-[var(--aws-orange)]">
        <div class="d-flex align-items-center">
          <div class="service-icon me-3">
            <i [class]="service.icon"></i>
          </div>
          <div>
            <h1 class="mb-1 text-primary-theme">{{ service.name }}</h1>
            <p class="text-secondary-theme mb-0">{{ service.description }}</p>
          </div>
        </div>
        <div class="text-right my-4">
          <div class="text-xs uppercase text-re text-gray-500 font-bold mb-1">Last Updated</div>
          <div>{{ service.lastUpdated }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-icon {
      font-size: 4rem;
      color: var(--aws-orange);
    }

    @media (max-width: 768px) {
      .service-icon {
        font-size: 3rem;
      }

      .d-flex {
        flex-direction: column;
        text-align: center;
      }

      .d-flex .me-3 {
        margin-right: 0 !important;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class FlashCardHeaderComponent {
  @Input({ required: true }) service!: FlashCardMetadata;
}
