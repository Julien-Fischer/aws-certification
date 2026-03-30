import Percentage from "./percentage";

export default class Ratio {

    readonly #brand = Symbol();

    private static readonly MIN_VALUE = 0;
    private static readonly MAX_VALUE = 1;

    public static readonly ZERO = new Ratio(0);
    public static readonly ONE = new Ratio(1);

    constructor(public readonly value: number) {
        Ratio.validate(value);
    }

    hasValue(value: number): boolean {
        return this.value === value;
    }

    isEqualTo(other: Ratio): boolean {
        return this.value === other.value;
    }

    isGreaterOrEqualTo(other: Ratio): boolean {
        return this.value >= other.value;
    }

    isGreaterThan(other: Ratio): boolean {
        return this.value > other.value;
    }

    isLessThan(other: Ratio): boolean {
        return this.value < other.value;
    }

    toPercentage(): Percentage {
        return new Percentage(this.value * 100);
    }

    toString(): string {
        return `${this.value.toFixed(2)}`;
    }

    private static validate(value: number): void {
        if (!Number.isFinite(value)) {
            throw new Error(`Ratio must be a finite number. Got ${value}`);
        }
        if (value < Ratio.MIN_VALUE) {
            throw new Error(`Ratio must be non‑negative. Got ${value}`);
        }
        if (value > Ratio.MAX_VALUE) {
            throw new Error(`Ratio cannot be greater than 1. Got ${value}`);
        }
    }

}