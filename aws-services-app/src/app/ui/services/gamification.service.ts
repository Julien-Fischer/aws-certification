import {Injectable, signal, effect, PLATFORM_ID, inject, WritableSignal, Inject} from '@angular/core';
import {Gamification} from "../../domain/scoring/gamification";
import {Storage} from "../../domain/scoring/storage";
import {GAMIFICATION_STORAGE} from "../../infra/scoring/gamification-local-storage-accessor";

export type Key =
  'gamification_enabled' |
  'highscore_enabled' |
  'score_enabled' |
  'progress_enabled';

interface Pair {
  key: Key;
  value: WritableSignal<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService implements Gamification {

  private _isEnabled = signal<boolean>(false);
  private _isScoresEnabled = signal<boolean>(true);
  private _isProgressEnabled = signal<boolean>(true);

  isEnabled = this._isEnabled.asReadonly();
  isScoredEnabled = this._isScoresEnabled.asReadonly();
  isProgressEnabled = this._isProgressEnabled.asReadonly();

  private pairs: Pair[] = [
    {key: 'gamification_enabled', value: this._isEnabled},
    {key: 'score_enabled',        value: this._isScoresEnabled},
    {key: 'progress_enabled',     value: this._isProgressEnabled},
  ];

  constructor(
    @Inject(GAMIFICATION_STORAGE) private readonly storageAccessor: Storage<Key, boolean>
  ) {
    this.loadState();
    effect(() => {
      this.saveState();
    });
  }

  toggle() {
    this._isEnabled.update(v => !v);
  }

  setScoresEnabled(enabled: boolean): void {
    this._isScoresEnabled.set(enabled);
  }
  setProgressEnabled(enabled: boolean): void {
    this._isProgressEnabled.set(enabled);
  }

  toggleProgress(): void {
    this.setProgressEnabled(!this.isProgressEnabled());
  }

  toggleScore(): void {
    this.setScoresEnabled(!this.isScoredEnabled());
  }



  private saveState() {
    this.pairs.forEach(pair => this.save(pair));
  }

  private loadState() {
    this.pairs.forEach(pair => this.load(pair));
  }

  private save(pair: Pair) {
    this.storageAccessor.setItem(pair.key, pair.value());
  }

  private load(pair: Pair) {
    const stored = this.storageAccessor.getItem(pair.key, undefined);

    if (stored == null) {
      return;
    }

    pair.value.set(stored);
  }
}
