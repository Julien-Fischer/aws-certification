import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {Gamification} from "./gamification";

@Injectable({
  providedIn: 'root'
})
export class GamificationService implements Gamification {

  private platformId = inject(PLATFORM_ID);
  private _isEnabled = signal<boolean>(false);

  isEnabled = this._isEnabled.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadState();
    }

    effect(() => {
      this.saveState();
    });
  }

  toggle() {
    this._isEnabled.update(v => !v);
  }

  private saveState() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('gamification_enabled', JSON.stringify(this._isEnabled()));
    }
  }

  private loadState() {
    const stored = localStorage.getItem('gamification_enabled');
    if (stored !== null) {
      try {
        this._isEnabled.set(JSON.parse(stored));
      } catch (e) {
        // Fallback to default if stored value is invalid
        this._isEnabled.set(false);
      }
    }
  }

}
