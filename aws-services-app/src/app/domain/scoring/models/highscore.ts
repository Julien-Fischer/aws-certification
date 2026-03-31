import Score from "./score";
import Percentage from "../../shared/percentage";

export default class Highscore extends Score {
    readonly #brand = Symbol();

    public static NONE = new Highscore(Percentage.ZERO, Percentage.ZERO, new Date('1970-01-01'), '');

    constructor(
        progress: Percentage,
        accuracy: Percentage,
        date: Date,
        public readonly serviceId: string,
    ) {
        super(progress, accuracy, date);
    }


    static from(score: Score, serviceId: string): Highscore {
        return new Highscore(score.progress, score.accuracy, score.date, serviceId);
    }


}