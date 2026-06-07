import {Question} from "./question";
import {Shuffle} from "../../shuffle";
import {Option} from "../option";
import {ExpectedCombination} from "../answers/expected-combination";

export class MultipleChoiceQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedCombination,
    readonly options: Option[]
  ) {
    super(label, answer);
  }

  shuffle(options: Option[], strategy: Shuffle) {
    const shuffled = strategy.shuffle(options);
    for (let i = 0; i < shuffled.length; i++) {
      this.options[i] = shuffled[i];
    }
  }
}
