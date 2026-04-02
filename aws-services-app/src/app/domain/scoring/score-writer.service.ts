import {Inject, Injectable} from "@angular/core";
import Score from "./models/score";
import {ScoreWriter} from "./score-writer";
import {FlashCardId} from "../shared/FlashCardId";
import Highscore from "./models/highscore";
import {storageInjectionToken} from "./storage";
import type {Storage} from "./storage";

@Injectable({
    providedIn: 'root',
})
export class ScoreWriterService implements ScoreWriter {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<FlashCardId, Highscore>
    ) { }

    score(serviceId: FlashCardId, score: Score): void {
        const highscore: Highscore = this.storage.getItem(serviceId, Highscore.NONE);
        if (score.beats(highscore)) {
            this.saveNewHighScore(serviceId, score);
        }
    }

    private saveNewHighScore(id: FlashCardId, score: Score) {
        const newHighscore = Highscore.from(score, new Date());
        this.storage.setItem(id, newHighscore);
    }
}
