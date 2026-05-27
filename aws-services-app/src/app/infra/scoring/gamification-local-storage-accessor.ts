import type {Storage} from "../../domain/scoring/storage"
import {Injectable, InjectionToken} from "@angular/core";
import {Key} from "../../ui/services/gamification.service";

export const GAMIFICATION_STORAGE = new InjectionToken<Storage<string, boolean>>('GamificationStorage');

@Injectable({
  providedIn: 'root',
})
export default class GamificationLocalStorageAccessor implements Storage<Key, boolean> {

  private static readonly PREFIX = "gamification:";

  clear(key?: string): void {
    if (key == null) {
      Object.keys(localStorage)
        .filter(key => key.startsWith(GamificationLocalStorageAccessor.PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } else {
      localStorage.removeItem(this.keyFor(key));
    }
  }

  getItem(key: string, defaultValue: boolean = false): boolean {
    const storeKey = this.keyFor(key);
    const item = localStorage.getItem(storeKey);
    if (item == null) {
      return defaultValue;
    }
    return toBoolean(item);
  }

  setItem(key: string, value: boolean): void {
    const storeKey = this.keyFor(key);
    const serialized = JSON.stringify(value);
    try {
      localStorage.setItem(storeKey, serialized);
    } catch (error) {
      console.error(`[local storage] failed to persist ${value} at ${storeKey}`, error);
    }
  }

  private keyFor(id: string): string {
    return `${GamificationLocalStorageAccessor.PREFIX}${id}`;
  }

}

function toBoolean(item: string): boolean {
  return JSON.parse(item);
}
