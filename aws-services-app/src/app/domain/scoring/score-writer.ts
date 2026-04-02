import Score from "./models/score";
import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import {FlashCardId} from "../shared/flash-card-id";

export const scoreWriterInjectionToken = new InjectionToken<Shuffler>('ScoreTracker');

export interface ScoreWriter {

    score(serviceId: FlashCardId, score: Score): void;

}