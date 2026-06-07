import { describe, it, expect } from 'vitest';
import {Option} from "../../models/option";
import {MultipleChoiceQuestion} from "../../models/questions/multiple-choice-question";
import {ExpectedCombination} from "../../models/answers/expected-combination";

describe('MultipleChoiceQuestion', () => {
  it('has a correct answer', () => {
    const question = new MultipleChoiceQuestion(
      `What does IAM stand for?`,
      new ExpectedCombination([
        Option.from('A'),
        Option.from('C')
      ]),
      [
        Option.from(`A. I Accidentally Managed`),
        Option.from(`B. It's Always Misconfigured`),
        Option.from(`C. Identity and Access Management`),
        Option.from(`D. Identity and Assets Manager`),
      ]
    );

    expect(question.hasAnswer(['A', 'C'])).toBe(true);

    expect(question.hasAnswer(['A'])).toBe(false);
    expect(question.hasAnswer(['C'])).toBe(false);
    expect(question.hasAnswer(['A', 'B'])).toBe(false);
    expect(question.hasAnswer(['B', 'C'])).toBe(false);
  })

  describe('explanation', () => {
    it('has an explanation', () => {
      const question = new MultipleChoiceQuestion(
        `Which option is correct?`,
        new ExpectedCombination([Option.from('C. Correct Option')], 'Explanation'),
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
      const question = new MultipleChoiceQuestion(
        `Which option is correct?`,
        new ExpectedCombination([Option.from('C. Correct Option')]),
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
