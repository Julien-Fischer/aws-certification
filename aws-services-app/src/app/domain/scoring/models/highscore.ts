import Score from "./score";
import Percentage from "./percentage";

export default class Highscore extends Score {
    readonly #brand = Symbol();

    public static NONE = new Highscore(Percentage.ZERO, Percentage.ZERO, new Date('1970-01-01'));

    constructor(
        progress: Percentage,
        accuracy: Percentage,
        public readonly date: Date = new Date()
    ) {
        super(progress, accuracy);
    }


    static from(score: Score, date: Date = new Date()): Highscore {
        return new Highscore(score.progress, score.accuracy, date);
    }

}