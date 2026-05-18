import {FlashCardMetadata} from "../models/metadata";
import {FlashCardProvider} from "../flash-card-provider";
import {FlashCardId} from "../../shared/flash-card-id";
import {FlashCard} from "../models/flash-card";
import {Observable, of} from "rxjs";

export class MockFlashCardProvider implements FlashCardProvider {

    private metadata: FlashCardMetadata[] = [];
    private cards: Map<FlashCardId, FlashCard> = new Map();

    havingServices(...services: FlashCardMetadata[]) {
        this.metadata.push(...services);
    }

    havingFlashCard(id: FlashCardId, card: FlashCard) {
        this.cards.set(id, card);
    }

    getAll(): Observable<FlashCardMetadata[]> {
        return of(this.metadata);
    }

    getCard(id: FlashCardId): Observable<FlashCard> {
        return of(this.cards.get(id)!);
    }

}
