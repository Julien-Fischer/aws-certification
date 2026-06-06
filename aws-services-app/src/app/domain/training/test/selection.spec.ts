import {describe, it, expect} from 'vitest';
import {Selection} from "../models/selection";
import {Option} from "../models/option";

describe('Selection', () => {

  it('constructs', () => {
    const selected = [
      Option.from('A. Option A'),
      Option.from('B. Option B')
    ];
    const answer = new Selection(selected);

    expect(answer.value).toBe(selected);
  });

  describe('accepts', () => {
    it('single value', () => {
      const expectedAnswer = new Selection([
        Option.from('A. Option A')
      ]);

      expect(expectedAnswer.accepts(['A'])).toBe(true);
      expect(expectedAnswer.accepts(['B'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'B'])).toBe(false);
    })

    it('mutliple values', () => {
      const expectedAnswer = new Selection([
        Option.from('A. Option A'),
        Option.from('B. Option B')
      ]);

      expect(expectedAnswer.accepts(['A', 'B'])).toBe(true);
      expect(expectedAnswer.accepts(['A'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'C'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'B', 'C'])).toBe(false);
    })
  })

  it('toString', () => {
    const answer = new Selection([
      Option.from('A. Option A'),
      Option.from('B. Option B')
    ]);

    expect(answer.toString()).toBe('[A. Option A, B. Option B]');
  })

});
