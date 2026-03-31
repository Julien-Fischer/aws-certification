import Score from "./models/score";
import {InjectionToken} from "@angular/core";
import {Shuffler} from "../../ui/services/shuffler";
import {AwsServiceId} from "../shared/AwsServiceId";

export const scoreWriterInjectionToken = new InjectionToken<Shuffler>('ScoreTracker');

export interface ScoreWriter {

    score(serviceId: AwsServiceId, score: Score): void;

}