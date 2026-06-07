import {UserAnswer} from "../../models/user-answer";
import {Option} from "../../models/option";
import {ExpectedAnswer} from "../../models/answers/expected-answer";
import {ExpectedChoice} from "../../models/answers/expected-choice";
import {ExpectedCombination} from "../../models/answers/expected-combination";

export function aUserAnswer(): UserAnswer {
  return 'A';
}

export function choice(value: string): ExpectedAnswer<any> {
  return new ExpectedChoice(Option.from(value));
}

export function combination(values: string[], explanation?: string): ExpectedAnswer<Option[]> {
  return new ExpectedCombination(values.map(Option.from), explanation);
}
