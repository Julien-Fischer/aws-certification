import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Neighbor, Neighbors, NavigationService} from './navigation.service';
import {FlashCardId} from "../../../../../domain/shared/flash-card-id";

@Component({
  selector: 'app-flash-card-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="navigation-buttons d-flex flex-col justify-content-between mt-5 pt-4 border-top">
      <a
        class="btn text-[var(--text-primary)] d-flex align-items-center justify-start gap-2"
        [routerLink]="prev.url"
      >
        <i class="fas fa-arrow-left"></i>
        {{ prev.label }}
      </a>

      <a
        class="btn text-[var(--text-primary)] d-flex align-items-center justify-end gap-2"
        [routerLink]="next.url"
      >
        {{ next.label }}
        <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  `,
  styles: [
    `
      .navigation-buttons {
        .btn {
          min-width: 120px;
          transition: all 0.2s ease-in-out;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          i {
            font-size: 0.8rem;
          }
        }
      }

      @media (min-width: 430px) {
        .navigation-buttons {
          flex-direction: row !important;
        }
      }
    `
  ]
})
export class FlashCardNavigationComponent implements OnChanges {

  @Input() id: FlashCardId | undefined = undefined;

  protected prev: Neighbor = {url: '', label: 'Previous'};
  protected next: Neighbor = {url: '', label: 'Next'};

  constructor(
    private navigation: NavigationService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.initNavigation(this.id);
    }
  }

  private initNavigation(flashCardId: FlashCardId) {
    this.navigation.loadNeighboringCards(flashCardId)
      .subscribe((neighbors: Neighbors) => {
        this.prev = neighbors.prev;
        this.next = neighbors.next;
      });
  }

}
