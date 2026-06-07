import {describe, it, expect} from 'vitest';
import {ExpectedBooleanAnswer} from "../../models/answers/expected-boolean-answer";

describe('BooleanAnswer', () => {

  it('constructs', () => {
    const trueAnswer = ExpectedBooleanAnswer.ofTrue();
    const falseAnswer = ExpectedBooleanAnswer.ofFalse();

    expect(trueAnswer.value).toBe(true);
    expect(falseAnswer.value).toBe(false);
  });

  describe('equals', () => {
    it('when true', () => {
      const expectedAnswer = ExpectedBooleanAnswer.ofTrue();

      expect(expectedAnswer.accepts(true)).toBe(true);
      expect(expectedAnswer.accepts(false)).toBe(false);
    })

    it('when false', () => {
      const expectedAnswer = ExpectedBooleanAnswer.ofFalse();

      expect(expectedAnswer.accepts(false)).toBe(true);
      expect(expectedAnswer.accepts(true)).toBe(false);
    })
  })

  describe('explanation', () => {
    it('with explanation', () => {
      const expectedAnswer = ExpectedBooleanAnswer.ofTrue('Explanation');

      expect(expectedAnswer.explanation).toBe('Explanation');
    })

    it('explanation is optional', () => {
      const expectedAnswer = ExpectedBooleanAnswer.ofFalse();

      expect(expectedAnswer.explanation).toBeUndefined();
    })
  })

  describe('toString', () => {
    it('true', () => {
      const answer = ExpectedBooleanAnswer.ofTrue();

      expect(answer.toString()).toBe('true');
    });

    it('false', () => {
      const answer = ExpectedBooleanAnswer.ofFalse();

      expect(answer.toString()).toBe('false');
    });
  })

});
