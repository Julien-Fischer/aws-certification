import {Inject, Injectable} from "@angular/core";
import Score from "./models/score";
import {HighscoreEvaluator} from "./highscore-evaluator";
import {FlashCardId} from "../shared/flash-card-id";
import Highscore from "./models/highscore";
import {storageInjectionToken} from "./storage";
import type {Storage} from "./storage";

@Injectable({
    providedIn: 'root',
})
export class SaveHighscoreService implements HighscoreEvaluator {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

    async submit(serviceId: FlashCardId, score: Score): Promise<Highscore> {
        const highscore: Highscore = this.storage.getItem(serviceId, Highscore.NONE);
        if (score.beats(highscore)) {
            return this.saveNewHighScore(serviceId, score);
        }
        return highscore;
    }

    private saveNewHighScore(id: FlashCardId, score: Score): Promise<Highscore> {
        const newHighscore = Highscore.from(score, new Date());
        this.storage.setItem(id, newHighscore);
        return Promise.resolve(newHighscore);
    }
}
