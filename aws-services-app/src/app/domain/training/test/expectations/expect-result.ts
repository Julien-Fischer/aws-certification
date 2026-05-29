import {Result} from "../../quiz";
import {expect} from "vitest";
import {Answer} from "../../models/answer";
import {Question} from "../../models/question";

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
      expect(result.isAnswerCorrect).toBe(true);
      return this;
    },

    toBeIncorrect() {
      expect(result.isAnswerCorrect).toBe(false);
      return this;
    },

    toHaveCorrectAnswer<T extends {toString: () => string}>(answer: T | Answer<any>) {
      const expected: Answer<any> = answer instanceof Answer ? answer : new Answer(answer);
      expect(result.expectedAnswer.equals(expected));
      return this;
    },

    toHaveExplanation(expected: string) {
      expect(result.explanation).toBe(expected);
      return this;
    },

    toHaveNoNextQuestion() {
      expect(result.nextQuestion).toBeUndefined();
      return this;
    },

    toHaveNextQuestion(expected: string) {
      expect(result.nextQuestion).toBeDefined();
      expect(result.nextQuestion?.label).toEqual(expected);
      return this;
    }
  }

}
