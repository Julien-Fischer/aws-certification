import {describe, it, expect} from 'vitest';
import {QuizOutcome} from "../../../domain/training/quiz";
import Percentage from "../../../domain/training/models/percentage";

describe('QuizOutcome', () => {

  it('from', () => {
    const outcome = QuizOutcome.from(Percentage.FIFTY, Percentage.ONE_HUNDRED);

    expect(outcome).toBeInstanceOf(QuizOutcome);
    expect(outcome.progress).toEqual(Percentage.FIFTY);
    expect(outcome.accuracy).toEqual(Percentage.ONE_HUNDRED);
  });

  it.for([0, 49])
  ('has failed when < 50%', (accuracy: number) => {
    const outcome = anOutcome().withAccuracy(accuracy);

    expect(outcome.hasFailed()).toBe(true);
  })

  it.for([50, 99])
  ('has succeeded when >= 50%', (accuracy: number) => {
    const outcome = anOutcome().withAccuracy(accuracy);

    expect(outcome.hasSucceeded()).toBe(true);
  })

  it('has mastered when == 100%', () => {
    const outcome = anOutcome().withAccuracy(100);

    expect(outcome.hasMastered()).toBe(true);
  })

})

function anOutcome() {
  return {
    withAccuracy(accuracy: number) {
      return QuizOutcome.from(new Percentage(100), new Percentage(accuracy));
    }
  }
}

