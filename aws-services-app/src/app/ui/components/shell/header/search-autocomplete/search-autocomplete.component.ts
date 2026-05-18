import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FlashCardMetadata } from '../../../../../domain/search/models/metadata';

@Component({
    selector: 'app-search-autocomplete',
    standalone: true,
    imports: [],
    templateUrl: './search-autocomplete.component.html',
    styleUrl: './search-autocomplete.component.scss',
})
export class SearchAutocompleteComponent {
    @Input() results: FlashCardMetadata[] = [];
    @Output() readonly selected = new EventEmitter<string>();

    readonly maxHeight = 400;

    selectCard(card: FlashCardMetadata): void {
        this.selected.emit(card.id);
    }
}
