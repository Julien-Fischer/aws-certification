import { describe, it, expect } from 'vitest';
import {BooleanQuestion} from "../../models/questions/boolean-question";
import {ExpectedBoolean} from "../../models/answers/expected-boolean";

describe('BooleanQuestion', () => {
  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'Identity and Access Management'`, ExpectedBoolean.ofTrue());

    expect(question.hasAnswer(true)).toBe(true);
    expect(question.hasAnswer(false)).toBe(false);
  })

  it('has a correct answer', () => {
    const question = new BooleanQuestion(`IAM stands for 'I Accidentally Managed'`, ExpectedBoolean.ofFalse());

    expect(question.hasAnswer(false)).toBe(true);
    expect(question.hasAnswer(true)).toBe(false);
  })

  describe('explanation', () => {
    it('has an explanation', () => {
      const question = new BooleanQuestion(
        `IAM stands for 'It's Always Misconfigured'`,
        ExpectedBoolean.ofFalse('Is this supposed to be a joke?')
      );

      expect(question.explanation)
        .toBe('Is this supposed to be a joke?');
    })

    it('isOptional', () => {
      const question = new BooleanQuestion(
        `IAM stands for 'It's Always Misconfigured'`,
        ExpectedBoolean.ofFalse()
      );

      expect(question.explanation)
        .toBeUndefined();
    })
  })
})

