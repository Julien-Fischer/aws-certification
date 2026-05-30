import {InjectionToken} from "@angular/core";
import Highscore from "./models/highscore";
import {FlashCardId} from "../shared/flash-card-id";

export const leaderboardInjectionToken = new InjectionToken<Leaderboard>('Leaderboard');

export interface Leaderboard {

    getHighscore(serviceId: FlashCardId): Highscore;

}
