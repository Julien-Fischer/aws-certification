import {InjectionToken} from "@angular/core";
import {FlashCardId} from "../shared/flash-card-id";
import {Observable} from "rxjs";

export const forgetHighscoreInjectionToken = new InjectionToken<HighscoreEraser>('HighscoreEraser');

export interface HighscoreEraser {

    forget(serviceId: FlashCardId): void;

    forgetAll(): void;

    readonly onReset: Observable<void>;

}
