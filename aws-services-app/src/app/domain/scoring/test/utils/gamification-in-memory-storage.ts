import type {Storage} from "../../storage";

export default class GamificationInMemoryStorage implements Storage<string, boolean> {

    private readonly map = new Map<string, boolean>();

    clear(key?: string): void {
        if (key == null) {
            this.map.clear();
        } else {
            this.map.delete(key);
        }
    }

    getItem(key: string, defaultValue: boolean): boolean {
        return this.map.get(key) ?? defaultValue;
    }

    setItem(key: string, value: boolean): void {
        this.map.set(key, value);
    }

}
