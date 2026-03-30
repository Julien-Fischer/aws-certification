import {Injectable, InjectionToken} from "@angular/core";

export const shufflerInjectionToken = new InjectionToken<Shuffler>('Shuffler');

export interface Shuffler {
  shuffle<T>(array: T[]): T[];
}

@Injectable({
  providedIn: 'root',
})
export class FisherYatesShuffler implements Shuffler {

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

}

