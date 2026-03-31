import Score from "../../models/score";
import Percentage from "../../../shared/percentage";
import {AwsServiceId} from "../../../shared/AwsServiceId";
import Highscore from "../../models/highscore";

export function aScore(): ScoreBuilder {
    return new ScoreBuilder();
}

export class ScoreBuilder {

    protected progress = 0;
    protected accuracy = 0;
    protected date = new Date('2026-03-30');

    completed(value: number) {
        this.progress = value;
        return this;
    }

    withAccuracy(value: number) {
        this.accuracy = value;
        return this;
    }

    on(value: Date) {
        this.date = value;
        return this;
    }

    build(): Score {
        return new Score(
            new Percentage(this.progress),
            new Percentage(this.accuracy),
            this.date
        );
    }
}

export function aHighscore(): HighscoreBuilder {
    return new HighscoreBuilder();
}

export class HighscoreBuilder extends ScoreBuilder {

    private serviceId: AwsServiceId = 'S3';

    forService(serviceId: AwsServiceId): HighscoreBuilder {
        this.serviceId = serviceId;
        return this;
    }

    override build(): Score {
        return new Highscore(
            new Percentage(this.progress),
            new Percentage(this.accuracy),
            this.date,
            this.serviceId
        );
    }
}