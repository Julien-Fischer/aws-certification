import {Option} from "../../models/multiple-choice-question";
import {ExpectedAnswer} from "../../models/expected-answer";
import {UserAnswer} from "../../models/user-answer";
import {MultipleChoiceAnswer} from "../../models/multiple-choice-answer";

export function aUserAnswer(): UserAnswer {
  return 'A';
}

export function anAnswer(): ExpectedAnswer<any> {
  return choice('A. First option');
}

export function choice(value: string): ExpectedAnswer<any> {
  return new MultipleChoiceAnswer(Option.from(value));
}
