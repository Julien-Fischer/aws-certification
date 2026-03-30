import { describe, it, expect } from 'vitest';
import {Option} from "../quiz";

describe('Option', () => {
    it('constructs with correct prefix and label from dotted string', () => {
        const option = new Option('A. First option text');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe(' First option text');
        expect(option.value).toBe('A. First option text');
    });

    it('constructs with multi-character prefix', () => {
        const option = new Option('XY. Multi char prefix');

        expect(option.prefix).toBe('XY');
        expect(option.label).toBe(' Multi char prefix');
    });

    it('handles prefix without space after dot', () => {
        const option = new Option('A.First option');

        expect(option.prefix).toBe('A');
        expect(option.label).toBe('First option');
    });

    it('extracts label with multiple spaces', () => {
        const option = new Option('B.   Multiple spaces');

        expect(option.prefix).toBe('B');
        expect(option.label).toBe('   Multiple spaces');
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

    it('preserves readonly properties', () => {
        const option = new Option('X. Readonly test');

        expect(option).toHaveProperty('prefix');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
    });
});