import {describe, it, expect} from 'vitest';
import {BooleanAnswer} from "../../models/answers/boolean-answer";

describe('BooleanAnswer', () => {

  it('constructs', () => {
    const trueAnswer = BooleanAnswer.TRUE;
    const falseAnswer = BooleanAnswer.FALSE;

    expect(trueAnswer.value).toBe(true);
    expect(falseAnswer.value).toBe(false);
  });

  describe('equals', () => {
    it('when true', () => {
      const expectedAnswer = BooleanAnswer.TRUE;

      expect(expectedAnswer.accepts(true)).toBe(true);
      expect(expectedAnswer.accepts(false)).toBe(false);
    })

    it('when false', () => {
      const expectedAnswer = BooleanAnswer.FALSE;

      expect(expectedAnswer.accepts(false)).toBe(true);
      expect(expectedAnswer.accepts(true)).toBe(false);
    })
  })

  describe('toString', () => {
    it('true', () => {
      const answer = BooleanAnswer.TRUE;

      expect(answer.toString()).toBe('true');
    });

    it('false', () => {
      const answer = BooleanAnswer.FALSE;

      expect(answer.toString()).toBe('false');
    });
  })

});
