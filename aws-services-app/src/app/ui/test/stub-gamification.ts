import {Gamification, gamificationInjectionToken} from "../../domain/scoring/gamification";

export class StubGamificationService implements Gamification {

    private _isEnabled = false;
    private _isScoresEnabled = false;
    private _isProgressEnabled = false;
    private _isHighscoreEnabled = false;

    isEnabled(): boolean {
        return this._isEnabled;
    }

    isHighscoreEnabled(): boolean {
        return this._isScoresEnabled;
    }

    isProgressEnabled(): boolean {
        return this._isProgressEnabled;
    }

    isScoredEnabled(): boolean {
        return this._isHighscoreEnabled;
    }

    toggle() {
      this._isEnabled = !this._isEnabled;
    }

    setHighscoreEnabled(enabled: boolean): void {
      this._isScoresEnabled = enabled;
    }

    setProgressEnabled(enabled: boolean): void {
      this._isProgressEnabled = enabled;
    }

    setScoresEnabled(enabled: boolean): void {
      this._isHighscoreEnabled = enabled;
    }

    toggleHighscore(): void {
      this._isScoresEnabled = !this._isScoresEnabled;
    }

    toggleProgress(): void {
      this._isProgressEnabled = !this._isProgressEnabled;
    }

    toggleScore(): void {
      this._isHighscoreEnabled = !this._isHighscoreEnabled;
    }

}

export function provideGamification() {
    return {provide: gamificationInjectionToken, useClass: StubGamificationService};
}
