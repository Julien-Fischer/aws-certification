import {UserAnswer} from "./user-answer";
import {Option} from "./multiple-choice-question";
import {ExpectedAnswer} from "./expected-answer";

export class Selection implements ExpectedAnswer<Option[]> {

  readonly #brand = Symbol();

  constructor(readonly value: Option[]) { }

  accepts(userAnswer: UserAnswer): boolean {
    if (!Array.isArray(userAnswer) || this.value.length !== userAnswer.length) {
      return false;
    }

    const sortedValue = [...this.value.map(option => option.prefix)].sort();
    const sortedStrings = [...userAnswer.map(option => option.toString())].sort();

    return sortedValue.every((value, i) => value === sortedStrings[i]);
  }

  toString(): string {
    return `[${this.value.map(option => option.toString()).join(', ')}]`;
  }

}
