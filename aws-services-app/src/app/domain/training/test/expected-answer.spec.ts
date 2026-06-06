import {describe, it, expect} from 'vitest';
import {Option} from "../models/multiple-choice-question";
import {ExpectedAnswer} from "../models/expected-answer";

describe('Answer', () => {

  describe('constructs', () => {
    it('constructs with boolean value', () => {
      const trueAnswer = new ExpectedAnswer(true);
      const falseAnswer = new ExpectedAnswer(false);

      expect(trueAnswer.value).toBe(true);
      expect(falseAnswer.value).toBe(false);
    });

    it('constructs with Option', () => {
      const value = Option.from('A. Answer');
      const answer = new ExpectedAnswer(value);

      expect(answer.value).toBe(value);
    });
  })

  describe('equals', () => {
    it('multiple-choice', () => {
      const expectedAnswer = new ExpectedAnswer(Option.from('A. An EC2 instance'));

      expect(expectedAnswer.accepts('A')).toBe(true);
      expect(expectedAnswer.accepts('B')).toBe(false);
    })

    describe('boolean', () => {
      it('when true', () => {
        const expectedAnswer = new ExpectedAnswer(true);

        expect(expectedAnswer.accepts(true)).toBe(true);
        expect(expectedAnswer.accepts(false)).toBe(false);
      })

      it('when false', () => {
        const expectedAnswer = new ExpectedAnswer(false);

        expect(expectedAnswer.accepts(false)).toBe(true);
        expect(expectedAnswer.accepts(true)).toBe(false);
      })
    })
  })

  describe('toString', () => {
    it('boolean input', () => {
      const answer = new ExpectedAnswer(true);

      expect(answer.toString()).toBe('true');
    });

    it('string input', () => {
      const answer = new ExpectedAnswer('hello');

      expect(answer.toString()).toBe('hello');
    });

    it('Option input', () => {
      const answer = new ExpectedAnswer(Option.from('A. Answer'));

      expect(answer.toString()).toBe('A. Answer');
    });
  })

});
