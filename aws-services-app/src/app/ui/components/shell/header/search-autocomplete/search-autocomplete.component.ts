import { Component, Output, EventEmitter, ElementRef, effect, input, viewChildren } from '@angular/core';
import { FlashCardMetadata } from '../../../../../domain/search/models/metadata';

@Component({
    selector: 'app-search-autocomplete',
    standalone: true,
    imports: [],
    templateUrl: './search-autocomplete.component.html',
    styleUrl: './search-autocomplete.component.scss',
})
export class SearchAutocompleteComponent {
    results = input<FlashCardMetadata[]>([]);
    selectedIndex = input<number>(-1);
    @Output() readonly selected = new EventEmitter<string>();

    resultItems = viewChildren<ElementRef<HTMLLIElement>>('resultItem');

    readonly maxHeight = 400;

    constructor() {
        effect(() => {
            const index = this.selectedIndex();
            const items = this.resultItems();
            if (index >= 0 && items.length > 0) {
                if (items[index]) {
                    items[index].nativeElement.scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    selectCard(card: FlashCardMetadata): void {
        this.selected.emit(card.id);
    }
}
