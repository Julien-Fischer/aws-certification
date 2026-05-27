import {InjectionToken} from "@angular/core";

export const gamificationInjectionToken = new InjectionToken<Gamification>("Gamification");

export interface Gamification {

    toggle(): void;

    toggleScore(): void;

    toggleProgress(): void;

    setScoresEnabled(enabled: boolean): void;

    setProgressEnabled(enabled: boolean): void;

    isEnabled(): boolean;

    isScoredEnabled(): boolean;

    isProgressEnabled(): boolean;

}
