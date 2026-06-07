import {UserAnswer} from "../user-answer";

export interface ExpectedAnswer<T> {

  value: T;

  accepts(userAnswer: UserAnswer): boolean;

  toString(): string;

}
