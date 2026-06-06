import {ExpectedAnswer} from "../../models/expected-answer";
import {UserAnswer} from "../../models/user-answer";
import {Choice} from "../../models/choice";
import {Option} from "../../models/option";

export function aUserAnswer(): UserAnswer {
  return 'A';
}

export function anAnswer(): ExpectedAnswer<any> {
  return choice('A. First option');
}

export function choice(value: string): ExpectedAnswer<any> {
  return new Choice(Option.from(value));
}
