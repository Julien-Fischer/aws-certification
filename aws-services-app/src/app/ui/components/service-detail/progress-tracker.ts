import Percentage from "../../../domain/shared/percentage";
import Score from "../../../domain/scoring/models/score";

export default class ProgressTracker {

    private correctAnswers = 0;
    private wrongAnswers = 0;
    private readonly totalAnswers: () => number;

    constructor(totalAnswers: () => number) {
        this.totalAnswers = totalAnswers;
    }

    update(correct: boolean) {
        if (correct) {
            this.correctAnswers++;
        } else {
            this.wrongAnswers++;
        }
    }

    get totalAttempts(): number {
        return this.correctAnswers + this.wrongAnswers;
    }

    get accuracy(): Percentage {
        return Percentage.ofRatio(this.correctAnswers / this.totalAnswers());
    }

    get progress(): Percentage {
        return Percentage.ofRatio(this.totalAttempts / this.totalAnswers());
    }

    get score(): Score {
        return new Score(this.progress, this.accuracy);
    }

}