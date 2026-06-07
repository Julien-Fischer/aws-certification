import {UserAnswer} from "../../models/user-answer";
import {Option} from "../../models/option";
import {ExpectedAnswer} from "../../models/answers/expected-answer";
import {ExpectedChoice} from "../../models/answers/expected-choice";

export function aUserAnswer(): UserAnswer {
  return 'A';
}

export function anAnswer(): ExpectedAnswer<any> {
  return choice('A. First option');
}

export function choice(value: string): ExpectedAnswer<any> {
  return new ExpectedChoice(Option.from(value));
}
