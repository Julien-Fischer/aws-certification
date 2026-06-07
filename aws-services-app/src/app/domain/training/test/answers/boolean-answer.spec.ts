import {describe, it, expect} from 'vitest';
import {BooleanAnswer} from "../../models/answers/boolean-answer";

describe('BooleanAnswer', () => {

  it('constructs', () => {
    const trueAnswer = BooleanAnswer.ofTrue();
    const falseAnswer = BooleanAnswer.ofFalse();

    expect(trueAnswer.value).toBe(true);
    expect(falseAnswer.value).toBe(false);
  });

  describe('equals', () => {
    it('when true', () => {
      const expectedAnswer = BooleanAnswer.ofTrue();

      expect(expectedAnswer.accepts(true)).toBe(true);
      expect(expectedAnswer.accepts(false)).toBe(false);
    })

    it('when false', () => {
      const expectedAnswer = BooleanAnswer.ofFalse();

      expect(expectedAnswer.accepts(false)).toBe(true);
      expect(expectedAnswer.accepts(true)).toBe(false);
    })
  })

  describe('explanation', () => {
    it('with explanation', () => {
      const expectedAnswer = BooleanAnswer.ofTrue('Explanation');

      expect(expectedAnswer.explanation).toBe('Explanation');
    })

    it('explanation is optional', () => {
      const expectedAnswer = BooleanAnswer.ofFalse();

      expect(expectedAnswer.explanation).toBeUndefined();
    })
  })

  describe('toString', () => {
    it('true', () => {
      const answer = BooleanAnswer.ofTrue();

      expect(answer.toString()).toBe('true');
    });

    it('false', () => {
      const answer = BooleanAnswer.ofFalse();

      expect(answer.toString()).toBe('false');
    });
  })

});
