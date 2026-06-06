import {UserAnswer} from "./user-answer";
import {Option} from "./multiple-choice-question";

export interface ExpectedAnswer<T> {

  value: T;

  accepts(userAnswer: UserAnswer): boolean;

  toString(): string;

}
