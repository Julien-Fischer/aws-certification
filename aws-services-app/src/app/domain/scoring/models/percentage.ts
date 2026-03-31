import Ratio from "./ratio";

export default class Percentage {

    readonly #brand = Symbol();

    private static readonly MIN_VALUE   = 0;
    private static readonly MAX_VALUE = 100;

    public static readonly ZERO        = new Percentage(0);
    public static readonly FIFTY       = new Percentage(50);
    public static readonly ONE_HUNDRED = new Percentage(100);

    constructor(public readonly value: number) {
        Percentage.validate(value);
    }

    hasValue(value: number): boolean {
        return this.value === value;
    }

    isEqualTo(other: Percentage): boolean {
        return this.value === other.value;
    }

    isGreaterOrEqualTo(other: Percentage): boolean {
        return this.value >= other.value;
    }

    isGreaterThan(other: Percentage): boolean {
        return this.value > other.value;
    }

    isLessThan(other: Percentage): boolean {
        return this.value < other.value;
    }

    toRatio(): Ratio {
        return new Ratio(this.value / 100);
    }

    toString(): string {
        return `${this.value}%`
    }

    toFixed(decimals: number): string {
        return this.value.toFixed(decimals) + '%';
    }

    public static ofRatio(ratio: number): Percentage {
        return new Ratio(ratio).toPercentage();
    }

    private static validate(value: number) {
        if (!Number.isFinite(value)) {
            throw new Error(`Percentage must be a finite number. Got ${value}`);
        }
        if (value < Percentage.MIN_VALUE) {
            throw new Error(`Percentage must be non-negative. Got ${value}`);
        }
        if (value > Percentage.MAX_VALUE) {
            throw new Error(`Percentage cannot be greater than 100. Got ${value}`);
        }
    }

}

