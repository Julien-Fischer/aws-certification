import {Highscore} from "./high-score";
import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";

export const scoreBoardInjectionToken = new InjectionToken<Shuffler>('ScoreBoard');

export interface ScoreBoard {

    getCategoryHighScore(categoryName: string): Highscore;

    getServiceHighScore(serviceName: string): Highscore;

}
