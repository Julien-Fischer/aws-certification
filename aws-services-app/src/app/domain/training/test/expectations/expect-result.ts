import {Result} from "../../quiz";
import {expect} from "vitest";
import {Answer} from "../../models/answer";

export function expectResult(result: Result) {

  return {

    toHaveProgress(value: number) {
      expect(
        result.progress.hasValue(value),
        `${value}% !== ${result.progress.toString()}`
      )
        .toBe(true);
      return this;
    },

    toHaveAccuracy(value: number) {
      expect(
        result.accuracy.hasValue(value),
        `${value}% !== ${result.accuracy.toString()}`
      )
        .toBe(true);
      return this;
    },

    toNotBeComplete() {
      expect(result.isComplete()).toBe(false);
      return this;
    },

    toBeComplete() {
      expect(result.isComplete()).toBe(true);
      return this;
    },

    toBeCorrect() {
      expect(result.isCorrect).toBe(true);
      return this;
    },

    toBeIncorrect() {
      expect(result.isCorrect).toBe(false);
      return this;
    },

    toHaveCorrectAnswer<T extends {toString: () => string}>(answer: T | Answer<any>) {
      const expected: Answer<any> = answer instanceof Answer ? answer : new Answer(answer);
      expect(result.correctAnswer.equals(expected));
      return this;
    }

  }

}
