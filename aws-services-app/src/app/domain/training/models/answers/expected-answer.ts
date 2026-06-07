import {UserAnswer} from "../user-answer";

export interface ExpectedAnswer<T> {

  value: T;

  explanation?: string;

  accepts(userAnswer: UserAnswer): boolean;

  toString(): string;

}
