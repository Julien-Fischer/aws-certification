export interface Quiz {
    question: string;
    answer: Answer<any>;
}

export interface MultipleChoiceQuiz extends Quiz {
    options: Option[];
    answer: Answer<Option>;
}

export interface TrueFalseQuiz extends Quiz {
    answer: Answer<boolean>;
}

export class Answer<T extends {toString: () => string}> {
    readonly #brand = Symbol();

    constructor(readonly value: T) { }

    toString(): string {
        return String(this.value.toString());
    }

}

export class Option {
    readonly #brand = Symbol();

    public readonly prefix: string;
    public readonly label: string;

    constructor(readonly value: string) {
        this.prefix = value.split('.')[0];
        this.label = value.split('.')[1];
    }

    hasPrefix(prefix: string): boolean {
        return this.prefix === prefix;
    }

    toString(): string {
        return String(this.value);
    }

}