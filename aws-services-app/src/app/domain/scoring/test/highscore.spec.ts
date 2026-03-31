import { describe, it, expect } from 'vitest';
import {aScore} from "./utils/score-builder";

describe('Score', () => {

    it('constructs successfully with valid percentages and date', () => {
        const score = aScore()
            .completed(75)
            .withAccuracy(90)
            .on(new Date('2026-03-30T10:00:00Z'))
            .build();

        expect(score.progress.value).toBe(75);
        expect(score.accuracy.value).toBe(90);
        expect(score.date).toBeInstanceOf(Date);
        expect(score.date.getTime()).toBe(new Date('2026-03-30T10:00:00Z').getTime());
    });

    it('progress takes precedence over accuracy', () => {
        const moreAdvancedButLessAccurate = aScore()
            .completed(51)
            .withAccuracy(10)
            .build()
        const lessAdvancedButMoreAccurate = aScore()
            .completed(50)
            .withAccuracy(99)
            .build()

        expect(moreAdvancedButLessAccurate.beats(lessAdvancedButMoreAccurate)).toBe(true);
        expect(lessAdvancedButMoreAccurate.beats(moreAdvancedButLessAccurate)).toBe(false);
    });

    it('higher score wins, progress being equal', () => {
        const bestAccuracy = aScore()
            .completed(60)
            .withAccuracy(85)
            .build();
        const lowerAccuracy = aScore()
            .completed(60)
            .withAccuracy(75)
            .build();

        expect(bestAccuracy.beats(lowerAccuracy)).toBe(true);
        expect(lowerAccuracy.beats(bestAccuracy)).toBe(false);
    });

    it('equal scores and progress are considered equal', () => {
        const a = aScore()
            .completed(60)
            .withAccuracy(80)
            .build();
        const b = aScore()
            .completed(60)
            .withAccuracy(80)
            .build();

        expect(a.beats(b)).toBe(false);
        expect(b.beats(a)).toBe(false);
    });

});