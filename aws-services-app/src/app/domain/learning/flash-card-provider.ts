import {InjectionToken} from "@angular/core";
import {FlashCardMetadata} from "./models/metadata";
import {Observable} from "rxjs";
import {FlashCard} from "./models/flash-card";
import {FlashCardId} from "../shared/FlashCardId";

export const flashCardProviderInjectionToken = new InjectionToken<FlashCardProvider>('FlashCardProvider');

export interface FlashCardProvider {

    getAll(): Observable<FlashCardMetadata[]>;

    getCard(id: FlashCardId): Observable<FlashCard>;
}
