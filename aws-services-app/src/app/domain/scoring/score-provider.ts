import {InjectionToken} from "@angular/core";
import {FlashCardId} from "../shared/flash-card-id";
import Highscore from "./models/highscore";

export const scoreProviderInjectionToken = new InjectionToken<ScoreProvider>('ScoreProvider');

export interface ScoreProvider {

    get(serviceId: FlashCardId): Highscore;

}
