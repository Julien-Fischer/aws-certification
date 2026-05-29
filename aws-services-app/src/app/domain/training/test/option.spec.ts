import { describe, it, expect } from 'vitest';
import {Option} from "../models/multiple-choice-question";

describe('Option', () => {
    it('constructs with correct prefix and label from dotted string', () => {
        const option = Option.from('A. First option text');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe('First option text');
        expect(option.toString()).toBe('A. First option text');
    });

    it('constructs with multi-character prefix', () => {
        const option = Option.from('XY. Multi char prefix');

        expect(option.prefix).toBe('XY');
        expect(option.label).toBe('Multi char prefix');
    });

    it('handles prefix without space after dot', () => {
        const option = Option.from('A.First option');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe('First option');
    });

    it('extracts label with multiple spaces', () => {
        const option = Option.from('B.   Multiple spaces');

        expect(option.prefix).toBe('B');
        expect(option.label).toBe('Multiple spaces');
    });

    it('hasPrefix returns true for matching prefix', () => {
        const option = Option.from('C. Matching prefix');

        expect(option.hasPrefix('C')).toBe(true);
        expect(option.hasPrefix('c')).toBe(false);
    });

    it('hasPrefix returns false for non-matching prefix', () => {
        const option = Option.from('D. Different prefix');

        expect(option.hasPrefix('A')).toBe(false);
        expect(option.hasPrefix('E')).toBe(false);
    });

    it('has an optional explanation', () => {
      const option = Option.from('A. Option label');
      const optionWithExplanation = Option.from('A. Option label', 'Explanation');

      expect(option.explanation).toBeUndefined();
      expect(optionWithExplanation.explanation).toBe('Explanation');
    })

    it('toString returns the original value', () => {
        const option = Option.from('Z. Original value');

        expect(option.toString()).toBe('Z. Original value');
    });
});
