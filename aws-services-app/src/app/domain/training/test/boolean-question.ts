import { describe, it, expect } from 'vitest';
import {BooleanQuestion} from "../models/boolean-question";
import {BooleanAnswer} from "../models/boolean-answer";

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

