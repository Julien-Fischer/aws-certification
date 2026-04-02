export class FlashCardId {

    readonly #brand = Symbol();

    constructor(public readonly value: string) {
        if (value == null || value.trim() === '') {
            throw new Error(`Invalid FlashCardId: '${value}'`);
        }
    }

    hasValue(value: string): boolean {
        return this.value === value;
    }

    toString(): string {
        return this.value.toString();
    }

}
