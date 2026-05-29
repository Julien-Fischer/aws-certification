export class QuizId {

    readonly #brand = Symbol();

    static random(): QuizId {
      return new QuizId(crypto.randomUUID());
    }

    constructor(public readonly value: string) {
        if (value == null || value.trim() === '') {
            throw new Error(`Invalid QuizId: '${value}'`);
        }
    }

    hasValue(value: string): boolean {
        return this.value === value;
    }

    toString(): string {
        return this.value.toString();
    }

}
