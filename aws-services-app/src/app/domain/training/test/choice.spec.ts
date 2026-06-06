import {describe, it, expect} from 'vitest';
import {Option} from "../models/multiple-choice-question";
import {ExpectedAnswer} from "../models/expected-answer";
import {BooleanAnswer} from "../models/boolean-answer";
import {Choice} from "../models/choice";

describe('Answer', () => {

  it('constructs', () => {
    const value = Option.from('A. Answer');
    const answer = new Choice(value);

    expect(answer.value).toBe(value);
  });

  it('accepts', () => {
    const expectedAnswer = new Choice(Option.from('A. An EC2 instance'));

    expect(expectedAnswer.accepts('A')).toBe(true);
    expect(expectedAnswer.accepts('B')).toBe(false);
  })

  it('toString', () => {
    const answer = new Choice(Option.from('A. Answer'));

    expect(answer.toString()).toBe('A. Answer');
  })

});
