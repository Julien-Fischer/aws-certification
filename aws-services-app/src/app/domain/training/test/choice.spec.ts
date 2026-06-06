import {describe, it, expect} from 'vitest';
import {Choice} from "../models/choice";
import {Option} from "../models/option";

describe('Choice', () => {

  it('constructs', () => {
    const option = Option.from('A. Answer');
    const answer = new Choice(option);

    expect(answer.value).toBe(option);
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
