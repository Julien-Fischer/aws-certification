import {Gamification, gamificationInjectionToken} from "../services/gamification";

export class StubGamificationService implements Gamification {

    isEnabled(): boolean {
        return true;
    }

    toggle() { }

}

export function provideGamification() {
    return {provide: gamificationInjectionToken, useClass: StubGamificationService};
}