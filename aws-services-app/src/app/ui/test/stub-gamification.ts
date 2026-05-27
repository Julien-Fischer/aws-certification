import {Gamification, gamificationInjectionToken} from "../../domain/scoring/gamification";

export class StubGamificationService implements Gamification {

    private _isEnabled = false;
    private _isScoresEnabled = true;
    private _isProgressEnabled = true;
    private _isHighscoreEnabled = true;

    isEnabled(): boolean {
        return this._isEnabled;
    }

    isHighscoreEnabled(): boolean {
        return this._isHighscoreEnabled;
    }

    isProgressEnabled(): boolean {
        return this._isProgressEnabled;
    }

    isScoredEnabled(): boolean {
        return this._isScoresEnabled;
    }

    toggle() {
      this._isEnabled = !this._isEnabled;
    }

    setHighscoreEnabled(enabled: boolean): void {
      this._isHighscoreEnabled = enabled;
    }

    setProgressEnabled(enabled: boolean): void {
      this._isProgressEnabled = enabled;
    }

    setScoresEnabled(enabled: boolean): void {
      this._isScoresEnabled = enabled;
    }

    toggleHighscore(): void {
      this._isHighscoreEnabled = !this._isHighscoreEnabled;
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
