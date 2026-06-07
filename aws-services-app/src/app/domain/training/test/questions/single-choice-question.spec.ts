import { describe, it, expect } from 'vitest';
import {SingleChoiceQuestion} from "../../models/questions/single-choice-question";
import {Option} from "../../models/option";
import {ExpectedChoice} from "../../models/answers/expected-choice";

describe('SingleChoiceQuestion', () => {
  it('has a correct answer', () => {
    const question = new SingleChoiceQuestion(
      `What does IAM stand for?`,
      new ExpectedChoice(Option.from('C. Identity and Access Management')),
      [
        Option.from(`A. I Accidentally Managed`),
        Option.from(`B. It's Always Misconfigured`),
        Option.from(`C. Identity and Access Management`),
        Option.from(`D. Identity and Assets Manager`),
      ]
    );

    expect(question.hasAnswer('C')).toBe(true);
    expect(question.hasAnswer('B')).toBe(false);
  })

  describe('explanation', () => {
    it('has an explanation', () => {
      const question = new SingleChoiceQuestion(
        `Which option is correct?`,
        new ExpectedChoice(Option.from('C. Correct Option'), 'Explanation'),
        [
          Option.from('A. Option 1'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option'),
          Option.from('D. Option 4')
        ]
      );

      expect(question.explanation).toBe('Explanation');
    })

    it('is optional', () => {
      const question = new SingleChoiceQuestion(
        `Which option is correct?`,
        new ExpectedChoice(Option.from('C. Correct Option')),
        [
          Option.from('A. Option 1'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option'),
          Option.from('D. Option 4')
        ]
      );

      expect(question.explanation).toBeUndefined();
    })
  })
})
