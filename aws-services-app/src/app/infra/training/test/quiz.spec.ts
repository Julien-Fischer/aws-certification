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

})
