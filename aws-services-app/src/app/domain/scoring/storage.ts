import {InjectionToken} from "@angular/core";

export const storageInjectionToken = new InjectionToken<Storage<any, any>>('Storage');

export interface Storage<K, V> {

    setItem(key: K, value: V): void;

    getItem(key: K, defaultValue: V): V;

    clear(): void;

}

