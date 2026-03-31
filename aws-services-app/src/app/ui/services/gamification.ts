import {InjectionToken} from "@angular/core";

export const gamificationInjectionToken = new InjectionToken("Gamification");

export interface Gamification {

    isEnabled(): boolean;
    toggle(): void;

}