import { describe, it, expect } from 'vitest';
import {aCompletedQuiz, aQuiz} from "./builders/quiz-builder";
import {
  aBooleanQuestion,
  aFalseStatement,
  aMultipleChoiceQuestion,
  aQuestion,
  aTrueStatement,
} from "./builders/question-builder";
import {Quiz} from "../quiz";
import {Answer} from "../models/answer";
import {anOption} from "./builders/option-builder";
import {expectResult} from "./expectations/expect-result";
import {anAnswer, choice} from "./builders/answer-builder";

describe('Quiz', () => {

  it('must have at least one question', () => {
    expect(() => new Quiz([]))
      .toThrow('No questions provided');
  })

  it('has a length', () => {
    const quiz = aQuiz()
      .with(aQuestion(), aQuestion())
      .build();

    expect(quiz.length).toBe(2);
  })

  it('is identified', () => {
    const quiz = aQuiz()
      .identified('my-quiz')
      .with(aQuestion(), aQuestion())
      .build();

    expect(quiz.id.hasValue('my-quiz'))
      .toBe(true);
  })

  describe('answer evaluation', () => {

    describe('boolean questions', () => {

      describe('true statement', () => {
        it('is true', () => {
          const quiz = aQuiz()
            .with(aTrueStatement())
            .build();

          const result = quiz.submit(new Answer(true));

          expectResult(result).toBeCorrect();
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aTrueStatement())
            .build();

          const result = quiz.submit(new Answer(false));

          expectResult(result).toBeIncorrect();
        })
      })

      describe('false statement', () => {
        it('is true', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(new Answer(false));

          expectResult(result).toBeCorrect();
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(new Answer(true));

          expectResult(result).toBeIncorrect();
        })
      })

      it('explanation', () => {
        const quiz = aQuiz()
          .with(
            aFalseStatement().withExplanation('Explanation for false statement'),
            aTrueStatement().withExplanation('Explanation for true statement')
          )
          .build();

        const result = quiz.submit(new Answer(true));

        expectResult(result)
          .toBeIncorrect()
          .toHaveExplanation('Explanation for false statement');
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

        expectResult(result).toBeCorrect();
      })

      it('is false when incorrect option is selected', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit(choice('B. Second option'));

        expectResult(result).toBeIncorrect();
      })

      it('is provides the correct answer when incorrect', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion()
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit(choice('C. Incorrect option 2'));

        expectResult(result)
          .toBeIncorrect()
          .toHaveCorrectAnswer(choice('B. Correct answer'));
      })

      it('is provides the correct answer when correct', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion()
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit(choice('B. Correct answer'));

        expectResult(result)
          .toBeCorrect()
          .toHaveCorrectAnswer(choice('B. Correct answer'));
      })

      it('explanation', () => {
        const quiz = aQuiz()
          .with(
            aMultipleChoiceQuestion()
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1').withExplanation('Explanation for incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit(choice('A. Incorrect option 1'));

        expectResult(result)
          .toBeIncorrect()
          .toHaveCorrectAnswer(choice('B. Correct answer'))
          .toHaveExplanation('Explanation for incorrect option 1');
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
      expectResult(result).toNotBeComplete();
    })

    it('is over when progress is 100', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      quiz.submit(anAnswer());
      const result = quiz.submit(anAnswer());

      expectResult(result).toHaveProgress(100);
      expectResult(result).toBeComplete();
    })

    it('is throws when submitting an answer when quiz is complete', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      quiz.submit(anAnswer());
      quiz.submit(anAnswer());

      expect(() => quiz.submit(anAnswer()))
        .toThrow('Quiz is already complete');
    })
  })

  describe('retry', () => {
    it('can be retried', () => {
      const quiz = aCompletedQuiz()
        .with(aTrueStatement(), aQuestion())

      quiz.retry();

      const secondTry = quiz.submit(new Answer(false));

      expectResult(secondTry)
        .toNotBeComplete()
        .toHaveProgress(50)
        .toHaveAccuracy(0);
    })
  })

  describe('outcome', () => {
    it('returns the outcome once completed', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      const result1 = quiz.submit(anAnswer());
      const result2 = quiz.submit(anAnswer());

      expect(result1.outcome).toBeUndefined();
      expect(result2.outcome).toBeDefined();
    })

    it('has failed when accuracy < 50%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(true));
      quiz.submit(new Answer(false));
      const result3 = quiz.submit(new Answer(false));

      expect(result3.outcome).toBeDefined();
      expect(result3.outcome?.hasFailed()).toBe(true);
    })

    it('has succeeded when accuracy >= 50%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(true));
      const result2 = quiz.submit(new Answer(false));

      expect(result2.outcome).toBeDefined();
      expect(result2.outcome?.hasFailed()).toBe(false);
      expect(result2.outcome?.hasSucceeded()).toBe(true);
      expect(result2.outcome?.hasMastered()).toBe(false);
    })

    it('has mastered when accuracy = 100%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      quiz.submit(new Answer(true));
      const result2 = quiz.submit(new Answer(true));

      expect(result2.outcome).toBeDefined();
      expect(result2.outcome?.hasFailed()).toBe(false);
      expect(result2.outcome?.hasSucceeded()).toBe(true);
      expect(result2.outcome?.hasMastered()).toBe(true);
    })

  })

  describe('next question', () => {
    it('returns the next question', () => {
      const quiz = aQuiz()
        .with(
          aQuestion(),
          aQuestion().labelled('IAM is an AWS service'),
          aQuestion()
        )
        .build();

      quiz.submit(anAnswer());
      const result = quiz.submit(anAnswer());

      expectResult(result)
        .toHaveNextQuestion('IAM is an AWS service');
    })

    it('has no next question left', () => {
      const quiz = aQuiz()
        .with(aQuestion())
        .build();

      const result = quiz.submit(anAnswer());

      expectResult(result).toHaveNoNextQuestion();
    })

    it('has no next question left', () => {
      const quiz = aQuiz()
        .with(aMultipleChoiceQuestion(), aBooleanQuestion().labelled('IAM is an AWS service'))
        .build();

      quiz.submit(anAnswer());
      const result = quiz.submit(anAnswer());

      expectResult(result).toHaveNoNextQuestion();
    })
  })

})


function reverseOrder() {
  return {
    shuffle<T>(array: T[]): T[] {
      return array.reverse();
    }
  }
}
