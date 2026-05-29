import { describe, it, expect } from 'vitest';
import {Answer} from "../models/answer";
import {BooleanQuestion} from "../models/boolean-question";
import {MultipleChoiceQuestion, Option} from "../models/multiple-choice-question";

describe('BooleanQuestion', () => {
  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'Identity and Access Management'`, new Answer(true));

    expect(question.hasAnswer(new Answer(true))).toBe(true);
    expect(question.hasAnswer(new Answer(false))).toBe(false);
  })

  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'I Accidentally Managed'`, new Answer(false));

    expect(question.hasAnswer(new Answer(false))).toBe(true);
    expect(question.hasAnswer(new Answer(true))).toBe(false);
  })

  it('finds explanation for an answer', () => {
    const question = new BooleanQuestion(
      `IAM stands for 'It's Always Misconfigured'`,
      new Answer(false),
      'Is this supposed to be a joke?'
    );

    expect(question.findExplanationFor(new Answer(true)))
      .toBe('Is this supposed to be a joke?');
    expect(question.findExplanationFor(new Answer(false)))
      .toBe('Is this supposed to be a joke?');
  })
})

describe('MultipleChoiceQuestion', () => {
  it('has a correct answer', () => {
    const question = new MultipleChoiceQuestion(
      `What does IAM stand for?`,
      new Answer(Option.from('C. Identity and Access Management')),
      [
        Option.from(`A. I Accidentally Managed`),
        Option.from(`B. It's Always Misconfigured`),
        Option.from(`C. Identity and Access Management`),
        Option.from(`D. Identity and Assets Manager`),
      ]
    );

    expect(question.hasAnswer(new Answer(Option.from(`C. Identity and Access Management`)))).toBe(true);
    expect(question.hasAnswer(new Answer(Option.from(`B. It's Always Misconfigured`)))).toBe(false);
  })

  describe('findExplanationFor', () => {
    it('finds explanation for any answer', () => {
      const question = new MultipleChoiceQuestion(
        `Which option is correct?`,
        new Answer(Option.from('C. Correct Option')),
        [
          Option.from('A. Option 1', 'Explanation for Option A'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option', 'Explanation for Option C'),
          Option.from('D. Option 4', 'Explanation for Option D'),
        ]
      );

      expect(question.findExplanationFor(option('C')))
        .toBe('Explanation for Option C');

      expect(question.findExplanationFor(option('D')))
        .toBe('Explanation for Option D');
    })

    it('supports multiple prefix format', () => {
      const question = new MultipleChoiceQuestion(
        `Which option is correct?`,
        new Answer(Option.from('C. Correct Option')),
        [
          Option.from('A. Option 1', 'Explanation for Option A'),
          Option.from('B. Option 2'),
          Option.from('C. Correct Option', 'Explanation for Option C'),
          Option.from('D. Option 4', 'Explanation for Option D'),
        ]
      );

      expect(question.findExplanationFor(option('C. Correct Option')))
        .toBe('Explanation for Option C');
      expect(question.findExplanationFor(option('C.')))
        .toBe('Explanation for Option C');
      expect(question.findExplanationFor(option('C')))
        .toBe('Explanation for Option C');
    })
  })
})



function option(prefix: string) {
  return new Answer(Option.from(prefix));
}
