import {describe, it, expect} from 'vitest';
import {Combination} from "../../models/answers/combination";
import {Option} from "../../models/option";

describe('Combination', () => {

  it('constructs', () => {
    const options = [
      Option.from('A. Option A'),
      Option.from('B. Option B')
    ];
    const answer = new Combination(options);

    expect(answer.value).toBe(options);
  });

  describe('accepts', () => {
    it('single value', () => {
      const expectedAnswer = new Combination([
        Option.from('A. Option A')
      ]);

      expect(expectedAnswer.accepts(['A'])).toBe(true);
      expect(expectedAnswer.accepts(['B'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'B'])).toBe(false);
    })

    it('mutliple values', () => {
      const expectedAnswer = new Combination([
        Option.from('A. Option A'),
        Option.from('B. Option B')
      ]);

      expect(expectedAnswer.accepts(['A', 'B'])).toBe(true);
      expect(expectedAnswer.accepts(['A'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'C'])).toBe(false);
      expect(expectedAnswer.accepts(['A', 'B', 'C'])).toBe(false);
    })
  })

  describe('explanation', () => {
    it('has an explanation', () => {
      const expectedAnswer = new Combination([
        Option.from('A. Option A'),
        Option.from('B. Option B')
      ], 'Explanation');

      expect(expectedAnswer.explanation).toBe('Explanation');
    })

    it('is optional', () => {
      const expectedAnswer = new Combination([
        Option.from('A. Option A'),
        Option.from('B. Option B')
      ]);

      expect(expectedAnswer.explanation).toBeUndefined();
    })
  })

  it('toString', () => {
    const answer = new Combination([
      Option.from('A. Option A'),
      Option.from('B. Option B')
    ]);

    expect(answer.toString()).toBe('[A. Option A, B. Option B]');
  })

});
