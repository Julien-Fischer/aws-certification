import { describe, it, expect } from 'vitest';
import {BooleanQuestion} from "../models/boolean-question";
import {MultipleChoiceQuestion} from "../models/multiple-choice-question";
import {BooleanAnswer} from "../models/boolean-answer";
import {Choice} from "../models/choice";
import {Option} from "../models/option";

describe('BooleanQuestion', () => {
  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'Identity and Access Management'`, BooleanAnswer.TRUE);

    expect(question.hasAnswer(true)).toBe(true);
    expect(question.hasAnswer(false)).toBe(false);
  })

  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'I Accidentally Managed'`, BooleanAnswer.FALSE);

    expect(question.hasAnswer(false)).toBe(true);
    expect(question.hasAnswer(true)).toBe(false);
  })

  it('finds explanation for an answer', () => {
    const question = new BooleanQuestion(
      `IAM stands for 'It's Always Misconfigured'`,
      BooleanAnswer.FALSE,
      'Is this supposed to be a joke?'
    );

    expect(question.findExplanationFor(true))
      .toBe('Is this supposed to be a joke?');
    expect(question.findExplanationFor(false))
      .toBe('Is this supposed to be a joke?');
  })
})

describe('MultipleChoiceQuestion', () => {
  it('has a correct answer', () => {
    const question = new MultipleChoiceQuestion(
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
      const question = new MultipleChoiceQuestion(
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
      const question = new MultipleChoiceQuestion(
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
