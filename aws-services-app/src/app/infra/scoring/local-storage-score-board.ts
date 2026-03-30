import {Injectable} from "@angular/core";
import {ScoreBoard} from "../../domain/scoring/score";
import {Highscore} from "../../domain/scoring/high-score";
import Percentage from "../../domain/shared/percentage";

@Injectable({
    providedIn: 'root',
})
export class LocalStorageScoreBoard implements ScoreBoard {

    getCategoryHighScore(categoryName: string): Highscore {
        return {
            completion: Percentage.ZERO,
            points: Percentage.ZERO
        };
    }

    getServiceHighScore(serviceName: string): Highscore {
        return {
            completion: Percentage.ZERO,
            points: Percentage.ZERO
        };
    }

}
