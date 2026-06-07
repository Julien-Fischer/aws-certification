export interface Question {
    label: string;
    answer: Answer<any>;
}

export interface MultipleChoiceQuestion extends Question {
  options: Option[];
  answer: Answer<Option[]>;
}

export interface SingleChoiceQuestion extends Question {
    options: Option[];
    answer: Answer<Option>;
}

export interface BooleanQuestion extends Question {
    answer: Answer<boolean>;
}

export class Answer<T extends {toString: () => string}> {
    readonly #brand = Symbol();

    constructor(
        readonly value: T,
        readonly explanation?: string
    ) { }

    isExplained(): boolean {
        return this.explanation != null;
    }

    toString(): string {
        return String(this.value.toString());
    }

}

export class Option {
    readonly #brand = Symbol();

    public readonly prefix: string;
    public readonly label: string;

    constructor(value: string) {
        const split = value.split('.');
        this.prefix = split[0];
        this.label = split[1].trimStart();
    }

    hasPrefix(prefix: string): boolean {
        return this.prefix === prefix;
    }

    toString(): string {
        return `${this.prefix}. ${this.label}`;
    }

}
