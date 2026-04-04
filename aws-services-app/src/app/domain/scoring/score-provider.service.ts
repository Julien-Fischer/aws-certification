import {Inject, Injectable} from "@angular/core";
import Highscore from "./models/highscore";
import {ScoreProvider} from "./score-provider";
import {FlashCardId} from "../shared/flash-card-id";
import {storageInjectionToken} from "./storage";
import type {Storage} from "./storage";

@Injectable({
    providedIn: 'root',
})
export class ScoreProviderService implements ScoreProvider {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

    get(serviceId: FlashCardId): Highscore {
        return this.storage.getItem(serviceId, Highscore.NONE);
    }
}
