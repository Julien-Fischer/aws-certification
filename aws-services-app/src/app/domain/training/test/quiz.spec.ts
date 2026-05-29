import { describe, it, expect } from 'vitest';
import {aQuiz} from "./builders/quiz-builder";
import {aFalseStatement, aQuestion, aTrueStatement} from "./builders/question-builder";
import {Quiz} from "../quiz";
import {Answer} from "../models/answer";

describe('Quiz', () => {

  it('must have questions', () => {
    expect(() => new Quiz([]))
      .toThrow('No questions provided');
  })

  it('has a length', () => {
    const quiz = aQuiz()
      .with(aQuestion(), aQuestion())
      .build();

    expect(quiz.length()).toBe(2);
  })

  describe('answer evaluation', () => {

    describe('boolean questions', () => {

      describe('true statement', () => {
        it('is true', () => {
          const quiz = aQuiz()
            .with(aTrueStatement())
            .build();

          const result = quiz.submit(new Answer(true));

          expect(result.isCorrect).toBe(true);
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aTrueStatement())
            .build();

          const result = quiz.submit(new Answer(false));

          expect(result.isCorrect).toBe(false);
        })
      })

      describe('false statement', () => {
        it('is true', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(new Answer(false));

          expect(result.isCorrect).toBe(true);
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(new Answer(true));

          expect(result.isCorrect).toBe(false);
        })
      })

    })

  })

})



