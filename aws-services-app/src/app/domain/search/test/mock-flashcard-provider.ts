import {FlashCardMetadata} from "../models/metadata";
import {FlashCardProvider} from "../flash-card-provider";
import {FlashCardId} from "../../shared/flash-card-id";
import {FlashCard} from "../models/flash-card";
import {BehaviorSubject, Observable} from "rxjs";

export class MockFlashCardProvider implements FlashCardProvider {

    private metadata$ = new BehaviorSubject<FlashCardMetadata[]>([]);
    private cards: Map<string, FlashCard> = new Map();

    havingServices(...services: FlashCardMetadata[]) {
        this.metadata$.next(services);
    }

    havingFlashCard(id: FlashCardId, card: FlashCard) {
        this.cards.set(id.toString(), card);
    }

    getAll(): Observable<FlashCardMetadata[]> {
        return this.metadata$.asObservable();
    }

    getCard(id: FlashCardId): Observable<FlashCard> {
        const card = this.cards.get(id.toString());
        if (!card) {
            return new BehaviorSubject<FlashCard>(null as any).asObservable();
        }
        return new BehaviorSubject(card).asObservable();
    }

}
