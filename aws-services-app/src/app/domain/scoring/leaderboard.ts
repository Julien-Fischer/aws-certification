import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import Highscore from "./models/highscore";
import {FlashCardId} from "../shared/FlashCardId";

export const leaderboardInjectionToken = new InjectionToken<Shuffler>('Leaderboard');

export interface Leaderboard {

    getHighscore(serviceId: FlashCardId): Highscore;

}
