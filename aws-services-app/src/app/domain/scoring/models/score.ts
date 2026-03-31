import Percentage from "../../shared/percentage";

export default class Score {
    readonly #brand = Symbol();

    constructor(
        public readonly progress: Percentage,
        public readonly accuracy: Percentage,
        public readonly date: Date = new Date()
    ) { }

    beats(other: Score): boolean {
        if (!this.progress.isEqualTo(other.progress)) {
            return this.progress.isGreaterThan(other.progress);
        }
        return this.accuracy.isGreaterThan(other.accuracy);
    }

    static of(progress: number, accuracy: number) {
        return new Score(new Percentage(progress), new Percentage(accuracy), new Date());
    }
}