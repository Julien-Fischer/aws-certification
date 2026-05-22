import {InjectionToken} from "@angular/core";

export const gamificationInjectionToken = new InjectionToken<Gamification>("Gamification");

export interface Gamification {

    isEnabled(): boolean;
    toggle(): void;

}
