import { describe, it, expect } from 'vitest';
import {SingleChoiceQuestion} from "../models/single-choice-question";
import {Choice} from "../models/choice";
import {Option} from "../models/option";

describe('SingleChoiceQuestion', () => {
  it('has a correct answer', () => {
    const question = new SingleChoiceQuestion(
      `What does IAM stand for?`,
      new Choice(Option.from('C. Identity and Access Management')),
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

  describe('findExplanationFor', () => {
    it('finds explanation for any answer', () => {
      const question = new SingleChoiceQuestion(
        `Which option is correct?`,
        new Choice(Option.from('C. Correct Option')),
        [
          Option.from('A. Option 1', 'Explanation for Option A'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option', 'Explanation for Option C'),
          Option.from('D. Option 4', 'Explanation for Option D'),
        ]
      );

      expect(question.findExplanationFor('C'))
        .toBe('Explanation for Option C');

      expect(question.findExplanationFor('D'))
        .toBe('Explanation for Option D');
    })

    it('is optional', () => {
      const question = new SingleChoiceQuestion(
        `Which option is correct?`,
        new Choice(Option.from('C. Correct Option')),
        [
          Option.from('A. Option 1', 'Explanation for Option A'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option', 'Explanation for Option C'),
          Option.from('D. Option 4', 'Explanation for Option D'),
        ]
      );

      expect(question.findExplanationFor('B'))
        .toBeUndefined();
    })
  })
})
