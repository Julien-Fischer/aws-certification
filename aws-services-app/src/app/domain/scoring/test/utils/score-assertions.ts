import Score from "../../models/score";
import {expect} from "vitest";
import Highscore from "../../models/highscore";
import {HighscoreBuilder} from "./score-builder";

export function expectThat(score: Score) {
    return {
        is(other: Score) {
            expect(score.isEqualTo(other)).toBe(true);
        },

        isNot(other: Score) {
            expect(score.isEqualTo(other)).toBe(false);
        },

        hasNoHighscore() {
            expectThat(score).is(Highscore.NONE);
        },

        isDefined() {
            expectThat(score).isNot(Highscore.NONE)
        },

        has(other: HighscoreBuilder) {
          expectThat(score).is(other.build());
        }
    }
}
