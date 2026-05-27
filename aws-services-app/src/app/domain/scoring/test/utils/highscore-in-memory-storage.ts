import {FlashCardId} from "../../../shared/flash-card-id";
import Highscore from "../../models/highscore";
import type {Storage} from "../../storage";

export default class HighscoreInMemoryStorage implements Storage<FlashCardId, Highscore> {

    private readonly map = new Map<FlashCardId, Highscore>();

    clear(key?: FlashCardId): void {
        if (key == null) {
            this.map.clear();
        } else {
            this.map.delete(key);
        }
    }

    getItem(key: FlashCardId, defaultValue: Highscore): Highscore {
        return this.map.get(key) ?? defaultValue;
    }

    setItem(key: FlashCardId, value: Highscore): void {
        this.map.set(key, value);
    }

}
