import {AwsServiceId} from "../../../shared/AwsServiceId";
import Highscore from "../../models/highscore";
import type {Storage} from "../../storage";

export default class InMemoryStorage implements Storage<AwsServiceId, Highscore> {

    private readonly map = new Map<AwsServiceId, Highscore>();

    clear(): void {
        this.map.clear();
    }

    getItem(key: AwsServiceId, defaultValue: Highscore): Highscore {
        return this.map.get(key) ?? defaultValue;
    }

    setItem(key: AwsServiceId, value: Highscore): void {
        this.map.set(key, value);
    }

}