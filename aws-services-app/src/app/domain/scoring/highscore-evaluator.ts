import Score from "./models/score";
import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import {FlashCardId} from "../shared/flash-card-id";
import Highscore from "./models/highscore";

export const saveHighscoreInjectionToken = new InjectionToken<Shuffler>('SaveHighscore');

export interface HighscoreEvaluator {

    submit(serviceId: FlashCardId, score: Score): Promise<Highscore>;

}
