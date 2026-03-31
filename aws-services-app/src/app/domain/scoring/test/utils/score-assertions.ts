import Score from "../../models/score";
import {expect} from "vitest";
import Highscore from "../../models/highscore";

export function expectThat(score: Score) {
    return {
        is(other: Score) {
            expect(score.isEqualTo(other)).toBe(true);
        },
        hasNoHighscore() {
            expectThat(score)
                .is(Highscore.NONE);
        }
    }
}