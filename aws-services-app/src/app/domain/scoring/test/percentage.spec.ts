import { describe, it, expect } from 'vitest';
import Percentage from "../models/percentage";

describe('Percentage', () => {

    it('constructs valid percentage', () => {
        const zero = new Percentage(0);
        const oneHundred = new Percentage(100);

        expect(zero.hasValue(0)).toBe(true);
        expect(oneHundred.hasValue(100)).toBe(true);
    });

    it('cannot construct invalid percentages', () => {
        expect(() => new Percentage(-1))
            .toThrow('Percentage must be non-negative. Got -1');
        expect(() => new Percentage(101))
            .toThrow('Percentage cannot be greater than 100. Got 101');
        expect(() => new Percentage(NaN))
            .toThrow('Percentage must be a finite number. Got NaN');
        expect(() => new Percentage(Infinity))
            .toThrow('Percentage must be a finite number. Got Infinity');
    });

    it('checks value', () => {
        expect(Percentage.ZERO.hasValue(0)).toBe(true);
        expect(Percentage.ONE_HUNDRED.hasValue(100)).toBe(true);
        expect(Percentage.ZERO.hasValue(100)).toBe(false);
        expect(Percentage.ONE_HUNDRED.hasValue(0)).toBe(false);
    });

    it('less than', () => {
        const fifty = new Percentage(50);
        const sixty = new Percentage(60);

        expect(fifty.isLessThan(sixty)).toBe(true);
        expect(sixty.isLessThan(fifty)).toBe(false);
    });

    it('greater than', () => {
        const fifty = new Percentage(50);
        const sixty = new Percentage(60);

        expect(fifty.isGreaterThan(sixty)).toBe(false);
        expect(sixty.isGreaterThan(fifty)).toBe(true);
    });

    it('greater or equal to', () => {
        const fifty = new Percentage(50);
        const sixty = new Percentage(60);

        expect(fifty.isGreaterOrEqualTo(fifty)).toBe(true);
        expect(fifty.isGreaterOrEqualTo(sixty)).toBe(false);
        expect(sixty.isGreaterOrEqualTo(fifty)).toBe(true);
        expect(sixty.isGreaterOrEqualTo(sixty)).toBe(true);
    });

    it('equal to', () => {
        expect(Percentage.ONE_HUNDRED.isEqualTo(new Percentage(100))).toBe(true);
        expect(Percentage.ZERO.isEqualTo(new Percentage(0))).toBe(true);
        expect(Percentage.ONE_HUNDRED.isEqualTo(Percentage.ZERO)).toBe(false);
        expect(Percentage.ZERO.isEqualTo(Percentage.ONE_HUNDRED)).toBe(false);
    });

    it('converts to Ratio', () => {
        expect(Percentage.ZERO.toRatio().value).toBe(0);
        expect(Percentage.FIFTY.toRatio().value).toBeCloseTo(0.5);
        expect(Percentage.ONE_HUNDRED.toRatio().value).toBe(1);
    });

    it('toString', () => {
        expect(Percentage.ZERO.toString()).toBe('0%');
        expect(Percentage.FIFTY.toString()).toBe('50%');
        expect(Percentage.ONE_HUNDRED.toString()).toBe('100%');
    });

    it('toFixed', () => {
        const oneAndAHalf = new Percentage(1.5);
        expect(oneAndAHalf.toFixed(0)).toBe('2%');
        expect(oneAndAHalf.toFixed(1)).toBe('1.5%');
        expect(oneAndAHalf.toFixed(2)).toBe('1.50%');
        expect(oneAndAHalf.toFixed(3)).toBe('1.500%');
    });

});