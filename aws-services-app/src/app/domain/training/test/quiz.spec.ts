import { describe, it, expect } from 'vitest';
import {aQuiz} from "./builders/quiz-builder";
import {aFalseStatement, aMultipleChoiceQuestion, aQuestion, aTrueStatement} from "./builders/question-builder";
import {Quiz} from "../quiz";
import {Answer} from "../models/answer";
import {Option} from "../models/multiple-choice-question";

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

    describe('multiple choice questions', () => {
      it('is true when correct option is selected', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit(anAnswer('A. First option'));

        expect(result.isCorrect).toBe(true);
      })

      it('is false when incorrect option is selected', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit(anAnswer('B. Second option'));

        expect(result.isCorrect).toBe(false);
      })
    })

  })

})

function anAnswer(value: string) {
  return new Answer(Option.from(value));
}



