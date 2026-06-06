import {describe, it, expect} from 'vitest';
import {Option} from "../models/multiple-choice-question";
import {ExpectedAnswer} from "../models/expected-answer";
import {BooleanAnswer} from "../models/boolean-answer";
import {MultipleChoiceAnswer} from "../models/multiple-choice-answer";

describe('Answer', () => {

  describe('constructs', () => {
    it('constructs with Option', () => {
      const value = Option.from('A. Answer');
      const answer = new MultipleChoiceAnswer(value);

      expect(answer.value).toBe(value);
    });
  })

  describe('equals', () => {
    it('multiple-choice', () => {
      const expectedAnswer = new MultipleChoiceAnswer(Option.from('A. An EC2 instance'));

      expect(expectedAnswer.accepts('A')).toBe(true);
      expect(expectedAnswer.accepts('B')).toBe(false);
    })
  })

  describe('toString', () => {
    it('Option input', () => {
      const answer = new MultipleChoiceAnswer(Option.from('A. Answer'));

      expect(answer.toString()).toBe('A. Answer');
    });
  })

});
