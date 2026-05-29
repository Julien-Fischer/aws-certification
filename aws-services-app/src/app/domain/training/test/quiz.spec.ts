import { describe, it, expect } from 'vitest';
import {aQuiz} from "./builders/quiz-builder";
import {aFalseStatement, aMultipleChoiceQuestion, aQuestion, aTrueStatement} from "./builders/question-builder";
import {Quiz, Result} from "../quiz";
import {Answer} from "../models/answer";
import {Option} from "../models/multiple-choice-question";

describe('Quiz', () => {

  it('must have at least one question', () => {
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

        const result = quiz.submit(choice('A. First option'));

        expect(result.isCorrect).toBe(true);
      })

      it('is false when incorrect option is selected', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit(choice('B. Second option'));

        expect(result.isCorrect).toBe(false);
      })
    })

  })

  describe('progress', () => {
    it('is 50% when halfway through', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      const result = quiz.submit(new Answer(true));

      expectResult(result).toHaveProgress(50);
    })

    it('is 100% when complete', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(true));
      const result = quiz.submit(new Answer(true));

      expectResult(result).toHaveProgress(100);
    })

    it('increases regardless of accuracy', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(false));
      const result = quiz.submit(new Answer(false));

      expectResult(result).toHaveProgress(100);
    })
  })

  describe('accuracy', () => {
    it('is 50% when halfway through', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      const result = quiz.submit(new Answer(true));

      expectResult(result).toHaveAccuracy(50);
    })

    it('is 100% when complete', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(true));
      const result = quiz.submit(new Answer(true));

      expectResult(result).toHaveAccuracy(100);
    })

    it('is 50% when 1/2 correct answers', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      quiz.submit(new Answer(true));
      const result = quiz.submit(new Answer(false));

      expectResult(result).toHaveAccuracy(50);
    })

    it('increases regardless of accuracy', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(false));
      const result = quiz.submit(new Answer(false));

      expectResult(result).toHaveAccuracy(0);
    })
  })

  describe('over', () => {
    it('is not over when progress < 100', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      const result = quiz.submit(anAnswer());

      expectResult(result).toHaveProgress(50);
      expectResult(result).toNotBeOver();
    })

    it('is over when progress is 100', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      quiz.submit(anAnswer());
      const result = quiz.submit(anAnswer());

      expectResult(result).toHaveProgress(100);
      expectResult(result).toBeOver();
    })
  })
})

function anAnswer() {
  return choice('A. First option');
}

function choice(value: string) {
  return new Answer(Option.from(value));
}

function expectResult(result: Result) {
  return {
    toHaveProgress(value: number) {
      expect(result.progress.hasValue(value)).toBe(true);
    },
    toHaveAccuracy(value: number) {
      expect(result.accuracy.hasValue(value)).toBe(true);
    },
    toNotBeOver() {
      expect(result.isOver).toBe(false);
    },
    toBeOver() {
      expect(result.isOver).toBe(true);
    }
  }
}


