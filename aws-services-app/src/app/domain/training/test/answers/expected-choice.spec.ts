import {describe, it, expect} from 'vitest';
import {Option} from "../../models/option";
import {ExpectedChoice} from "../../models/answers/expected-choice";

describe('Choice', () => {

  it('constructs', () => {
    const option = Option.from('A. Answer');
    const answer = new ExpectedChoice(option);

    expect(answer.value).toBe(option);
  });

  it('accepts', () => {
    const expectedAnswer = new ExpectedChoice(Option.from('A. An EC2 instance'));

    expect(expectedAnswer.accepts('A')).toBe(true);
    expect(expectedAnswer.accepts('B')).toBe(false);
  })

  describe('explanation', () => {
    it('with explanation', () => {
      const expectedAnswer = new ExpectedChoice(Option.from('A. An EC2 instance'), 'Explanation');

      expect(expectedAnswer.explanation).toBe('Explanation');
    })

    it('explanation is optional', () => {
      const expectedAnswer = new ExpectedChoice(Option.from('A. An EC2 instance'));

      expect(expectedAnswer.explanation).toBeUndefined();
    })
  })

  it('toString', () => {
    const answer = new ExpectedChoice(Option.from('A. Answer'));

    expect(answer.toString()).toBe('A. Answer');
  })

});
