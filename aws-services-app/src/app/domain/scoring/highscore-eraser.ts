import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import {FlashCardId} from "../shared/flash-card-id";

export const forgetHighscoreInjectionToken = new InjectionToken<Shuffler>('HighscoreEraser');

export interface HighscoreEraser {

    forget(serviceId: FlashCardId): void;

}
