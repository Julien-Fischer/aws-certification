import {FisherYatesShuffle, NoShuffle, Shuffle} from "../../domain/training/shuffle";
import {InjectionToken} from "@angular/core";

export const shuffleProviderInjectionToken = new InjectionToken<ShuffleProvider>('ShuffleProvider');

export interface ShuffleProvider {
  get(shuffle: boolean): Shuffle;
}

export class DefaultShuffleProvider implements ShuffleProvider {

  get(shuffle: boolean): Shuffle {
    return shuffle ? FisherYatesShuffle : NoShuffle;
  }

}
