import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import Highscore from "./models/highscore";
import {AwsServiceId} from "../shared/AwsServiceId";

export const leaderboardInjectionToken = new InjectionToken<Shuffler>('Leaderboard');

export interface Leaderboard {

    getHighscore(serviceId: AwsServiceId): Highscore;

}
