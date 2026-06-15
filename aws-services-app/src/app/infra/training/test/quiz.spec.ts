import {describe, it, expect} from 'vitest';
import {QuizOutcome} from "../../../domain/training/quiz";
import Percentage from "../../../domain/training/models/percentage";

describe('QuizOutcome', () => {

  it.for([0, 49])
  ('has failed when < 50%', (accuracy: number) => {
    const outcome = anOutcome().withAccuracy(accuracy);

    expect(outcome === QuizOutcome.FAIL).toBe(true);
  })

  it.for([50, 99])
  ('has succeeded when >= 50%', (accuracy: number) => {
    const outcome = anOutcome().withAccuracy(accuracy);

    expect(outcome === QuizOutcome.PASS).toBe(true);
  })

  it('has mastered when == 100%', () => {
    const outcome = anOutcome().withAccuracy(100);

    expect(outcome === QuizOutcome.MASTER).toBe(true);
  })

})

function anOutcome() {
  return {
    withAccuracy(accuracy: number) {
      return QuizOutcome.from(new Percentage(accuracy));
    }
  }
}

