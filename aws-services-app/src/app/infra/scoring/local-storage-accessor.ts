import {FlashCardId} from "../../domain/shared/FlashCardId";
import Highscore from "../../domain/scoring/models/highscore";
import type {Storage} from "../../domain/scoring/storage"
import {Injectable} from "@angular/core";
import Percentage from "../../domain/scoring/models/percentage";

@Injectable({
    providedIn: 'root',
})
export default class LocalStorageAccessor implements Storage<FlashCardId, Highscore> {

    private static readonly PREFIX = "highscore:";

    clear(): void {
        localStorage.removeItem(LocalStorageAccessor.PREFIX);
    }

    getItem(key: FlashCardId, defaultValue: Highscore): Highscore {
        const storeKey = this.keyFor(key);
        const item = localStorage.getItem(storeKey);
        if (item == null) {
            return defaultValue;
        }
        return toHighscore(item);
    }

    setItem(key: FlashCardId, value: Highscore): void {
        const storeKey = this.keyFor(key);
        const serialized = JSON.stringify(value);
        try {
            localStorage.setItem(storeKey, serialized);
        } catch (error) {
            console.error(`[local storage] failed to persist ${value} at ${storeKey}`, error);
        }
    }

    private keyFor(id: FlashCardId): string {
        return `${LocalStorageAccessor.PREFIX}${id}`;
    }

}

function toHighscore(item: string): Highscore {
    const parsed = JSON.parse(item);
    return new Highscore(
        new Percentage(parsed.progress.value),
        new Percentage(parsed.accuracy.value),
        parsed.date
    );
}