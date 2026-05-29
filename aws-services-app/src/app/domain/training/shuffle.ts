export interface Shuffle {
  shuffle<T>(array: T[]): T[];
}

export class FisherYatesShuffle implements Shuffle {

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

}

export const NoShuffle: Shuffle = {

  shuffle<T>(array: T[]): T[] {
    return array;
  }

}
