import {describe, it, expect} from 'vitest';
import {Answer} from "../answer";
import {Option} from "../multiple-choice-question";

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

  describe('explanation is optional', () => {
    it('has no explanation', () => {
      const multipleChoiceAnswer = new Answer(Option.from('A. Answer'));
      const booleanAnswer = new Answer(true);

      expect(multipleChoiceAnswer.isExplained()).toBe(false);
      expect(booleanAnswer.isExplained()).toBe(false);
    })

    it('has an explanation', () => {
      const multipleChoiceAnswer = new Answer(Option.from('A. Answer'), 'explanation');
      const booleanAnswer = new Answer(true, 'explanation');

      expect(multipleChoiceAnswer.isExplained()).toBe(true);
      expect(booleanAnswer.isExplained()).toBe(true);
    })
  })

  describe('equals', () => {
    describe('multiple-choice', () => {
      it('is equal', () => {
        const a = new Answer('An EC2 instance');
        const b = new Answer('An EC2 instance');
        const different = new Answer('An S3 bucket');

        expect(a.equals(b)).toBe(true);
        expect(a.equals(different)).toBe(false);
      })

      it('is equal regardless of explanation', () => {
        const withoutExplanation = new Answer('An EC2 instance');
        const withExplanation = new Answer('An EC2 instance', 'EC2 instances are virtual servers');

        expect(withoutExplanation.equals(withExplanation)).toBe(true);
      })
    })

    describe('boolean', () => {
      it('is equal', () => {
        const a = new Answer(true);
        const b = new Answer(true);
        const different = new Answer(false);

        expect(a.equals(b)).toBe(true);
        expect(a.equals(different)).toBe(false);
      })

      it('is equal', () => {
        const a = new Answer(false);
        const b = new Answer(false);
        const different = new Answer(true);

        expect(a.equals(b)).toBe(true);
        expect(a.equals(different)).toBe(false);
      })

      it('is equal regardless of explanation', () => {
        const withoutExplanation = new Answer(true);
        const withExplanation = new Answer(true, 'EC2 instances are virtual servers');

        expect(withoutExplanation.equals(withExplanation)).toBe(true);
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
