import { describe, it, expect } from 'vitest';
import Ratio from "../Ratio";
import Percentage from "../percentage";

describe('Ratio', () => {
    it('constructs valid ratio', () => {
        const zero = new Ratio(0);
        const one = new Ratio(1);

        expect(zero.hasValue(0)).toBe(true);
        expect(one.hasValue(1)).toBe(true);
    });

    it('cannot construct invalid ratios', () => {
        expect(() => new Ratio(-0.1))
            .toThrow('Ratio must be non‑negative. Got -0.1');
        expect(() => new Ratio(1.1))
            .toThrow('Ratio cannot be greater than 1. Got 1.1');
        expect(() => new Ratio(NaN))
            .toThrow('Ratio must be a finite number. Got NaN');
        expect(() => new Ratio(Infinity))
            .toThrow('Ratio must be a finite number. Got Infinity');
    });

    it('checks value', () => {
        expect(Ratio.ZERO.hasValue(0)).toBe(true);
        expect(Ratio.ONE.hasValue(1)).toBe(true);
        expect(Ratio.ZERO.hasValue(1)).toBe(false);
        expect(Ratio.ONE.hasValue(0)).toBe(false);
    });

    it('less than', () => {
        const half = new Ratio(0.5);
        const twoThirds = new Ratio(0.6667);

        expect(half.isLessThan(twoThirds)).toBe(true);
        expect(twoThirds.isLessThan(half)).toBe(false);
    });

    it('greater than', () => {
        const half = new Ratio(0.5);
        const twoThirds = new Ratio(0.6667);

        expect(half.isGreaterThan(twoThirds)).toBe(false);
        expect(twoThirds.isGreaterThan(half)).toBe(true);
    });

    it('greater or equal to', () => {
        const half = new Ratio(0.5);
        const twoThirds = new Ratio(0.6667);

        expect(half.isGreaterOrEqualTo(half)).toBe(true);
        expect(half.isGreaterOrEqualTo(twoThirds)).toBe(false);
        expect(twoThirds.isGreaterOrEqualTo(half)).toBe(true);
        expect(twoThirds.isGreaterOrEqualTo(twoThirds)).toBe(true);
    });

    it('equal to', () => {
        expect(Ratio.ONE.isEqualTo(new Ratio(1))).toBe(true);
        expect(Ratio.ZERO.isEqualTo(new Ratio(0))).toBe(true);
        expect(Ratio.ONE.isEqualTo(Ratio.ZERO)).toBe(false);
        expect(Ratio.ZERO.isEqualTo(Ratio.ONE)).toBe(false);
    });

    it('converts to Percentage', () => {
        const half = new Ratio(0.5);

        expect(Ratio.ZERO.toPercentage().value).toBe(0);
        expect(half.toPercentage().value).toBe(50);
        expect(Ratio.ONE.toPercentage().value).toBe(100);

        expect(Ratio.ZERO.toPercentage()).toBeInstanceOf(Percentage);
        expect(half.toPercentage()).toBeInstanceOf(Percentage);
        expect(Ratio.ONE.toPercentage()).toBeInstanceOf(Percentage);
    });

    it('toString', () => {
        expect(Ratio.ZERO.toString()).toBe('0.00');
        expect(new Ratio(0.5).toString()).toBe('0.50');
        expect(Ratio.ONE.toString()).toBe('1.00');
    });

});