import {Result} from "../../quiz";
import {expect} from "vitest";
import {UserAnswer} from "../../models/user-answer";

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

    toHaveCorrectAnswer(answer: UserAnswer) {
      expect(result.expectedAnswer.accepts(answer));
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
