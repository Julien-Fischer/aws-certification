import {Question} from "./question";
import {Shuffle} from "../../shuffle";
import {Option} from "../option";
import {ExpectedChoice} from "../answers/expected-choice";

export class SingleChoiceQuestion extends Question {

  readonly #brand = Symbol();

  constructor(
    label: string,
    answer: ExpectedChoice,
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
