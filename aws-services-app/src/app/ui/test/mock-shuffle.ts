import {ShuffleProvider} from "../../infra/training/shuffle-provider";
import {NoShuffle, Shuffle} from "../../domain/training/shuffle";

export class DeterministicShuffleProvider implements ShuffleProvider {

  constructor(private deterministicShuffle: Shuffle) {
  }

  get(shuffle: boolean): Shuffle {
    return shuffle ? this.deterministicShuffle : NoShuffle;
  }

}

export class MockNoShuffle implements Shuffle {

  private called = false;

  shuffle<T>(array: T[]): T[] {
    this.called = true;
    return array;
  }

  wasCalled(): boolean {
    return this.called;
  }

}
