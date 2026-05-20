import { describe, it, expect } from 'vitest';
import Score from "../models/score";

describe('Score', () => {

    it('progress takes precedence over accuracy', () => {
        const bestAccuracy  = Score.of(51,  0);
        const lowerAccuracy = Score.of(50, 99);

        expect(bestAccuracy.beats(lowerAccuracy)).toBe(true);
        expect(lowerAccuracy.beats(bestAccuracy)).toBe(false);
    });

    it('higher accuracy wins when progress are equal', () => {
        const bestAccuracy  = Score.of(60, 85);
        const lowerAccuracy = Score.of(60, 75);

        expect(bestAccuracy.beats(lowerAccuracy)).toBe(true);
        expect(lowerAccuracy.beats(bestAccuracy)).toBe(false);
    });

    it('two scores are equal when their components are equal', () => {
        const a = Score.of(60, 80);
        const b = Score.of(60, 80);

        expect(a.beats(b)).toBe(false);
        expect(b.beats(a)).toBe(false);
        expect(a.isEqualTo(b)).toBe(true);
    });

    it('two scores are not equal when their components differ', () => {
        const a = Score.of(10, 20);
        const b = Score.of(99, 20);
        const c = Score.of(10, 99);

        expect(a.isEqualTo(b)).toBe(false);
        expect(a.isEqualTo(c)).toBe(false);
        expect(b.isEqualTo(c)).toBe(false);
    });

});