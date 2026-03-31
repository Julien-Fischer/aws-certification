import {Inject, Injectable} from "@angular/core";
import Score from "./models/score";
import {ScoreWriter} from "./score-writer";
import {AwsServiceId} from "../shared/AwsServiceId";
import Highscore from "./models/highscore";
import {storageInjectionToken} from "./storage";
import type {Storage} from "./storage";

@Injectable({
    providedIn: 'root',
})
export class ScoreWriterService implements ScoreWriter {

    constructor(
        @Inject(storageInjectionToken) private storage: Storage<AwsServiceId, Highscore>
    ) { }

    score(serviceId: AwsServiceId, score: Score): void {
        const highscore: Highscore = this.storage.getItem(serviceId, Highscore.NONE);
        if (score.beats(highscore)) {
            console.log('high score bested!')
            this.saveNewHighScore(serviceId, score);
        }
    }

    private saveNewHighScore(serviceId: AwsServiceId, score: Score) {
        const newHighscore = Highscore.from(score, serviceId);
            console.log('writing new high score!!!', score.progress.toString(), score.accuracy.toString(), score)
        this.storage.setItem(serviceId, newHighscore);
    }
}
