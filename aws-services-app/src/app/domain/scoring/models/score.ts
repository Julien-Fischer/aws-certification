import Percentage from "./percentage";

export default class Score {
    readonly #brand = Symbol();

    constructor(
        public readonly progress: Percentage,
        public readonly accuracy: Percentage
    ) { }

    beats(other: Score): boolean {
        if (!this.progress.isEqualTo(other.progress)) {
            return this.progress.isGreaterThan(other.progress);
        }
        return this.accuracy.isGreaterThan(other.accuracy);
    }

    isEqualTo(other: Score): boolean {
        return (
            this.progress.isEqualTo(other.progress) &&
            this.accuracy.isEqualTo(other.accuracy)
        );
    }

    static of(progress: number, accuracy: number) {
        return new Score(new Percentage(progress), new Percentage(accuracy));
    }
}