import {Answer} from "../../models/answer";
import {Option} from "../../models/multiple-choice-question";

export function anAnswer() {
  return choice('A. First option');
}

export function choice(value: string) {
  return new Answer(Option.from(value));
}

