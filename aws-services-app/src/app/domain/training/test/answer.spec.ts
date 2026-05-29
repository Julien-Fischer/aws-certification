import {describe, it, expect} from 'vitest';
import {Answer} from "../models/answer";
import {Option} from "../models/multiple-choice-question";

describe('Answer', () => {

  describe('constructs', () => {
    it('constructs with string value', () => {
      const answer = new Answer('hello');

      expect(answer.value).toBe('hello');
    });

    it('constructs with boolean value', () => {
      const trueAnswer = new Answer(true);
      const falseAnswer = new Answer(false);

      expect(trueAnswer.value).toBe(true);
      expect(falseAnswer.value).toBe(false);
    });

    it('constructs with Option', () => {
      const value = Option.from('A. Answer');
      const answer = new Answer(value);

      expect(answer.value).toBe(value);
    });
  })

  describe('equals', () => {
    it('multiple-choice', () => {
      const a = new Answer('An EC2 instance');
      const b = new Answer('An EC2 instance');
      const different = new Answer('An S3 bucket');

      expect(a.equals(b)).toBe(true);
      expect(a.equals(different)).toBe(false);
    })

    describe('boolean', () => {
      it('when true', () => {
        const a = new Answer(true);
        const b = new Answer(true);
        const different = new Answer(false);

        expect(a.equals(b)).toBe(true);
        expect(a.equals(different)).toBe(false);
      })

      it('when false', () => {
        const a = new Answer(false);
        const b = new Answer(false);
        const different = new Answer(true);

        expect(a.equals(b)).toBe(true);
        expect(a.equals(different)).toBe(false);
      })
    })
  })

  describe('toString', () => {
    it('boolean input', () => {
      const answer = new Answer(true);

      expect(answer.toString()).toBe('true');
    });

    it('string input', () => {
      const answer = new Answer('hello');

      expect(answer.toString()).toBe('hello');
    });

    it('Option input', () => {
      const answer = new Answer(Option.from('A. Answer'));

      expect(answer.toString()).toBe('A. Answer');
    });
  })

});
