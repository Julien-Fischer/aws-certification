import {describe, it, expect} from 'vitest';
import {ExpectedBoolean} from "../../models/answers/expected-boolean";

describe('BooleanAnswer', () => {

  it('constructs', () => {
    const trueAnswer = ExpectedBoolean.ofTrue();
    const falseAnswer = ExpectedBoolean.ofFalse();

    expect(trueAnswer.value).toBe(true);
    expect(falseAnswer.value).toBe(false);
  });

  describe('equals', () => {
    it('when true', () => {
      const expectedAnswer = ExpectedBoolean.ofTrue();

      expect(expectedAnswer.accepts(true)).toBe(true);
      expect(expectedAnswer.accepts(false)).toBe(false);
    })

    it('when false', () => {
      const expectedAnswer = ExpectedBoolean.ofFalse();

      expect(expectedAnswer.accepts(false)).toBe(true);
      expect(expectedAnswer.accepts(true)).toBe(false);
    })
  })

  describe('explanation', () => {
    it('with explanation', () => {
      const expectedAnswer = ExpectedBoolean.ofTrue('Explanation');

      expect(expectedAnswer.explanation).toBe('Explanation');
    })

    it('explanation is optional', () => {
      const expectedAnswer = ExpectedBoolean.ofFalse();

      expect(expectedAnswer.explanation).toBeUndefined();
    })
  })

  describe('toString', () => {
    it('true', () => {
      const answer = ExpectedBoolean.ofTrue();

      expect(answer.toString()).toBe('true');
    });

    it('false', () => {
      const answer = ExpectedBoolean.ofFalse();

      expect(answer.toString()).toBe('false');
    });
  })

});
