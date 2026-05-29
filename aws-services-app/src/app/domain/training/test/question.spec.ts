import { describe, it, expect } from 'vitest';
import {Answer} from "../models/answer";
import {BooleanQuestion} from "../models/boolean-question";
import {MultipleChoiceQuestion, Option} from "../models/multiple-choice-question";

describe('Question', () => {

  describe('boolean questions', () => {
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
  })

  describe('multiple choice questions', () => {
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
  })

})
