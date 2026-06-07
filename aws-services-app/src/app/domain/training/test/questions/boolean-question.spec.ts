import { describe, it, expect } from 'vitest';
import {BooleanQuestion} from "../../models/questions/boolean-question";
import {BooleanAnswer} from "../../models/answers/boolean-answer";

describe('BooleanQuestion', () => {
  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'Identity and Access Management'`, BooleanAnswer.ofTrue());

    expect(question.hasAnswer(true)).toBe(true);
    expect(question.hasAnswer(false)).toBe(false);
  })

  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'I Accidentally Managed'`, BooleanAnswer.ofFalse());

    expect(question.hasAnswer(false)).toBe(true);
    expect(question.hasAnswer(true)).toBe(false);
  })

  describe('explanation', () => {
    it('has an explanation', () => {
      const question = new BooleanQuestion(
        `IAM stands for 'It's Always Misconfigured'`,
        BooleanAnswer.of(false, 'Is this supposed to be a joke?')
      );

      expect(question.explanation)
        .toBe('Is this supposed to be a joke?');
    })

    it('isOptional', () => {
      const question = new BooleanQuestion(
        `IAM stands for 'It's Always Misconfigured'`,
        BooleanAnswer.of(false)
      );

      expect(question.explanation)
        .toBeUndefined();
    })
  })
})

