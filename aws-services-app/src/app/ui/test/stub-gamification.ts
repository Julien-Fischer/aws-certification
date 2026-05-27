import {Gamification, gamificationInjectionToken} from "../../domain/scoring/gamification";

export class StubGamificationService implements Gamification {

    private _isEnabled = false;
    private _isScoresEnabled = true;
    private _isProgressEnabled = true;

    isEnabled(): boolean {
        return this._isEnabled;
    }

    isProgressEnabled(): boolean {
        return this._isProgressEnabled;
    }

    isAccuracyEnabled(): boolean {
        return this._isScoresEnabled;
    }

    toggle() {
      this._isEnabled = !this._isEnabled;
    }

    setProgressEnabled(enabled: boolean): void {
      this._isProgressEnabled = enabled;
    }

    setScoresEnabled(enabled: boolean): void {
      this._isScoresEnabled = enabled;
    }

    toggleProgress(): void {
      this._isProgressEnabled = !this._isProgressEnabled;
    }

    toggleScore(): void {
      this._isScoresEnabled = !this._isScoresEnabled;
    }

}

export function provideGamification() {
    return {provide: gamificationInjectionToken, useClass: StubGamificationService};
}
