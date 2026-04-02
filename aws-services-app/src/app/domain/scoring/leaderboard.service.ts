import {Inject, Injectable} from "@angular/core";
import {Leaderboard} from "./leaderboard";
import Highscore from "./models/highscore";
import {FlashCardId} from "../shared/FlashCardId";
import {storageInjectionToken} from "./storage";
import type {Storage} from "./storage";

@Injectable({
    providedIn: 'root',
})
export class LeaderBoardService implements Leaderboard {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

    getHighscore(serviceId: FlashCardId): Highscore {
        return this.storage.getItem(serviceId, Highscore.NONE);
    }

}
