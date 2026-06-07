import { describe, it, expect } from 'vitest';
import {Option} from "../models/question";

describe('Option', () => {
    it('constructs with correct prefix and label from dotted string', () => {
        const option = new Option('A. First option text');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe('First option text');
        expect(option.toString()).toBe('A. First option text');
    });

    it('constructs with multi-character prefix', () => {
        const option = new Option('XY. Multi char prefix');

        expect(option.prefix).toBe('XY');
        expect(option.label).toBe('Multi char prefix');
        expect(option.toString()).toBe('XY. Multi char prefix');
    });

    it('handles prefix without space after dot', () => {
        const option = new Option('A.First option');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe('First option');
    });

    it('extracts label with multiple spaces', () => {
        const option = new Option('B.   Multiple spaces');

        expect(option.prefix).toBe('B');
        expect(option.label).toBe('Multiple spaces');
        expect(option.toString()).toBe('B. Multiple spaces');
    });

    it('hasPrefix returns true for matching prefix', () => {
        const option = new Option('C. Matching prefix');

        expect(option.hasPrefix('C')).toBe(true);
        expect(option.hasPrefix('c')).toBe(false);
    });

    it('hasPrefix returns false for non-matching prefix', () => {
        const option = new Option('D. Different prefix');

        expect(option.hasPrefix('A')).toBe(false);
        expect(option.hasPrefix('E')).toBe(false);
    });

    it('toString returns the original value', () => {
        const option = new Option('Z. Original value');

        expect(option.toString()).toBe('Z. Original value');
    });

    describe('equals', () => {
      it('is equal when value is equal', () => {
        const option = new Option('A. Option value');

        expect(option.equals('A. Option value')).toBe(true);
        expect(option.equals(new Option('A. Option value'))).toBe(true);
      })

      it('is equal when values differ', () => {
        const option = new Option('A. Option value');

        expect(option.equals('B. Option value')).toBe(false);
        expect(option.equals(new Option('B. Option value'))).toBe(false);
        expect(option.equals('B. Another value')).toBe(false);
        expect(option.equals(new Option('B. Another value'))).toBe(false);
      })

      it('is not equal to null', () => {
        const option = new Option('A. Option value');

        expect(option.equals(null)).toBe(false);
      })
    })

});
