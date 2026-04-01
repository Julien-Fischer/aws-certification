import { describe, it, expect } from 'vitest';
import Percentage from '../../../domain/scoring/models/percentage';
import ProgressTracker from "./progress-tracker";

describe('ProgressTracker', () => {

    const totalAnswers = 10;

    const aTrackerForTenAnswers = () => new ProgressTracker(() => totalAnswers);

    it('starts with zero correct and wrong answers', () => {
        const tracker = aTrackerForTenAnswers();

        expect(tracker.totalAttempts).toBe(0);
        expect(tracker.accuracy.hasValue(0)).toBe(true);
        expect(tracker.progress.hasValue(0)).toBe(true);
    });

    it('updates correct and wrong answers properly', () => {
        const tracker = aTrackerForTenAnswers();
        tracker.update(true);
        tracker.update(false);
        tracker.update(true);

        expect(tracker.totalAttempts).toBe(3);
        expect(tracker.accuracy.hasValue((2 / totalAnswers) * 100)).toBe(true);
        expect(tracker.progress.hasValue((3 / totalAnswers) * 100)).toBe(true);
    });

    it('computes accuracy correctly when all answers are correct', () => {
        const tracker = aTrackerForTenAnswers();

        for (let i = 0; i < totalAnswers; i++) {
            tracker.update(true);
        }

        expect(tracker.totalAttempts).toBe(totalAnswers);
        expect(tracker.accuracy.isEqualTo(Percentage.ONE_HUNDRED)).toBe(true);
        expect(tracker.progress.isEqualTo(Percentage.ONE_HUNDRED)).toBe(true);
    });

    it('computes accuracy correctly when all answers are wrong', () => {
        const tracker = aTrackerForTenAnswers();

        for (let i = 0; i < totalAnswers; i++) {
            tracker.update(false);
        }

        expect(tracker.totalAttempts).toBe(totalAnswers);
        expect(tracker.accuracy.isEqualTo(Percentage.ZERO)).toBe(true);
        expect(tracker.progress.isEqualTo(Percentage.ONE_HUNDRED)).toBe(true);
    });

    it('creates a valid score combining accuracy and progress', () => {
        const tracker = aTrackerForTenAnswers();
        tracker.update(true);
        tracker.update(false);

        const score = tracker.score;
        expect(score.accuracy.hasValue(10)).toBe(true);
        expect(score.progress.hasValue(20)).toBe(true);
    });

});