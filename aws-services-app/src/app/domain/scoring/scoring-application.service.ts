import { Injectable, Inject } from '@angular/core';
import { HighscoreEvaluator, saveHighscoreInjectionToken } from './highscore-evaluator';
import { ScoreProvider, scoreProviderInjectionToken } from './score-provider';
import { Gamification, gamificationInjectionToken } from './gamification';
import { HighscoreEraser, forgetHighscoreInjectionToken } from './highscore-eraser';
import Score from './models/score';
import Highscore from './models/highscore';
import { FlashCardId } from '../shared/flash-card-id';

export interface AnswerResult {
  highscore: Highscore;
  isNewHighscore: boolean;
  isMaximum: boolean;
  deservesReward: boolean;
}

@Injectable({ providedIn: 'root' })
export class ScoringAppService {

  constructor(
    @Inject(saveHighscoreInjectionToken) private saveHighscore: HighscoreEvaluator,
    @Inject(scoreProviderInjectionToken) private scoreProvider: ScoreProvider,
    @Inject(gamificationInjectionToken) private gamification: Gamification,
    @Inject(forgetHighscoreInjectionToken) private forgetHighscore: HighscoreEraser
  ) { }

  async submitAnswer(flashCardId: FlashCardId, score: Score): Promise<AnswerResult> {
    const previousHighscore = this.scoreProvider.get(flashCardId);
    const newHighscore = await this.saveHighscore.submit(flashCardId, score);

    const isNewHighscore = newHighscore.hasBetterAccuracyThan(previousHighscore);
    const isMaximum = newHighscore.isMaximum();

    const deservesReward =
      this.gamification.isEnabled() &&
      isNewHighscore &&
      previousHighscore.hasBetterAccuracyThan(Highscore.NONE);

    return {
      highscore: newHighscore,
      isNewHighscore,
      isMaximum,
      deservesReward,
    };
  }

  isGamificationEnabled(): boolean {
    return this.gamification.isEnabled();
  }

  resetHighscore(flashCardId: FlashCardId): void {
    this.forgetHighscore.forget(flashCardId);
  }

  getHighscore(flashCardId: FlashCardId): Highscore {
    return this.scoreProvider.get(flashCardId);
  }

  isFirstAttempt(highscore: Highscore): boolean {
    return !highscore.beats(Highscore.NONE);
  }

  get onReset() {
    return this.forgetHighscore.onReset;
  }
}
