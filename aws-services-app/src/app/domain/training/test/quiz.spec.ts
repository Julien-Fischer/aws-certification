import { describe, it, expect } from 'vitest';
import {aCompletedQuiz, aQuiz} from "./builders/quiz-builder";
import {
  aBooleanQuestion,
  aFalseStatement,
  aSingleChoiceQuestion,
  aQuestion,
  aTrueStatement,
} from "./builders/question-builder";
import {Quiz, QuizOutcome} from "../quiz";
import {anOption} from "./builders/option-builder";
import {expectResult} from "./expectations/expect-result";
import {aUserAnswer} from "./builders/answer-builder";
import {UserAnswer} from "../models/user-answer";

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

          const result = quiz.submit(true);

          expectResult(result).toBeCorrect();
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aTrueStatement())
            .build();

          const result = quiz.submit(false);

          expectResult(result).toBeIncorrect();
        })
      })

      describe('false statement', () => {
        it('is true', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(false);

          expectResult(result).toBeCorrect();
        })

        it('is false', () => {
          const quiz = aQuiz()
            .with(aFalseStatement())
            .build();

          const result = quiz.submit(true);

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

        const result = quiz.submit(true);

        expectResult(result)
          .toBeIncorrect()
          .toHaveExplanation('Explanation for false statement');
      })

    })

    describe('multiple choice questions', () => {
      it('is true when correct option is selected', () => {
        const quiz = aQuiz()
          .with(
            aSingleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit('A');

        expectResult(result).toBeCorrect();
      })

      it('is false when incorrect option is selected', () => {
        const quiz = aQuiz()
          .with(
            aSingleChoiceQuestion().withAnswer('A. First option')
          )
          .build();

        const result = quiz.submit('B');

        expectResult(result).toBeIncorrect();
      })

      it('is provides the correct answer when incorrect', () => {
        const quiz = aQuiz()
          .with(
            aSingleChoiceQuestion()
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit('C');

        expectResult(result)
          .toBeIncorrect()
          .toHaveCorrectAnswer('B');
      })

      it('is provides the correct answer when correct', () => {
        const quiz = aQuiz()
          .with(
            aSingleChoiceQuestion()
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit('B');

        expectResult(result)
          .toBeCorrect()
          .toHaveCorrectAnswer('B');
      })

      it('explanation', () => {
        const quiz = aQuiz()
          .with(
            aSingleChoiceQuestion().withExplanation('Explanation for incorrect option 1')
              .withAnswer('B. Correct answer')
              .withOptions(
                anOption().withValue('A. Incorrect option 1'),
                anOption().withValue('B. Correct Answer'),
                anOption().withValue('C. Incorrect option 2'),
              )
          )
          .build();

        const result = quiz.submit('A');

        expectResult(result)
          .toBeIncorrect()
          .toHaveCorrectAnswer('B')
          .toHaveExplanation('Explanation for incorrect option 1');
      })
    })

  })

  describe('progress', () => {
    it('is 50% when halfway through', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      const result = quiz.submit(true);

      expectResult(result).toHaveProgress(50);
    })

    it('is 100% when complete', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(true).to(quiz);

      const result = quiz.submit(true);

      expectResult(result).toHaveProgress(100);
    })

    it('increases regardless of accuracy', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(false).to(quiz);

      const result = quiz.submit(false);

      expectResult(result).toHaveProgress(100);
    })
  })

  describe('accuracy', () => {
    it('is 50% when halfway through', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      const result = quiz.submit(true);

      expectResult(result).toHaveAccuracy(50);
    })

    it('is 100% when complete', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(true).to(quiz);

      const result = quiz.submit(true);

      expectResult(result).toHaveAccuracy(100);
    })

    it('is 50% when 1/2 correct answers', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aQuestion())
        .build();

      havingSent(true).to(quiz);

      const result = quiz.submit(false);

      expectResult(result).toHaveAccuracy(50);
    })

    it('increases regardless of accuracy', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(false).to(quiz);

      const result = quiz.submit(false);

      expectResult(result).toHaveAccuracy(0);
    })
  })

  describe('over', () => {
    it('is not over when progress < 100', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      const result = quiz.submit(aUserAnswer());

      expectResult(result).toHaveProgress(50);
      expectResult(result).toNotBeComplete();
    })

    it('is over when progress is 100', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      havingSentAnAnswer().to(quiz);

      const result = quiz.submit(aUserAnswer());

      expectResult(result).toHaveProgress(100);
      expectResult(result).toBeComplete();
    })

    it('is throws when submitting an answer when quiz is complete', () => {
      const quiz = aQuiz()
        .with(aQuestion(), aQuestion())
        .build();

      quiz.submit(aUserAnswer());
      quiz.submit(aUserAnswer());

      expect(() => quiz.submit(aUserAnswer()))
        .toThrow('Quiz is already complete');
    })
  })

  describe('retry', () => {
    it('can be retried', () => {
      const quiz = aCompletedQuiz()
        .with(aTrueStatement(), aQuestion())

      quiz.retry();

      const secondTry = quiz.submit(false);

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

      const result1 = quiz.submit(aUserAnswer());
      const result2 = quiz.submit(aUserAnswer());

      expect(result1.outcome).toBeUndefined();
      expect(result2.outcome).toBeDefined();
    })

    it('has failed when accuracy < 50%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement(), aTrueStatement())
        .build();

      havingSent(true).to(quiz);
      havingSent(false).to(quiz);

      const result = quiz.submit(false);

      expect(result.outcome).toBeDefined();
      expect(result.outcome === QuizOutcome.FAIL).toBe(true);
    })

    it('has succeeded when accuracy >= 50%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(true).to(quiz);

      const result2 = quiz.submit(false);

      expect(result2.outcome).toBeDefined();
      expect(result2.outcome === QuizOutcome.SUCCESS).toBe(true);
    })

    it('has mastered when accuracy = 100%', () => {
      const quiz = aQuiz()
        .with(aTrueStatement(), aTrueStatement())
        .build();

      havingSent(true).to(quiz);

      const result2 = quiz.submit(true);

      expect(result2.outcome).toBeDefined();
      expect(result2.outcome === QuizOutcome.MASTER).toBe(true);
    })

  })

  describe('next question', () => {
    it('returns the next question', () => {
      const quiz = aQuiz()
        .with(
          aQuestion().labelled('question 1'),
          aQuestion().labelled('question 2'),
          aQuestion().labelled('question 3')
        )
        .build();

      const result1 = quiz.submit(aUserAnswer());
      const result2 = quiz.submit(aUserAnswer());

      expectResult(result1)
        .toHaveNextQuestion('question 2');
      expectResult(result2)
        .toHaveNextQuestion('question 3');
    })

    it('has no next question left', () => {
      const quiz = aQuiz()
        .with(aQuestion())
        .build();

      const result = quiz.submit(aUserAnswer());

      expectResult(result).toHaveNoNextQuestion();
    })

    it('has no next question left', () => {
      const quiz = aQuiz()
        .with(aSingleChoiceQuestion(), aBooleanQuestion().labelled('IAM is an AWS service'))
        .build();

      havingSentAnAnswer().to(quiz);

      const result = quiz.submit(aUserAnswer());

      expectResult(result).toHaveNoNextQuestion();
    })
  })

  function havingSent(userAnswer: UserAnswer) {
    return {
      to(quiz: Quiz) {
        quiz.submit(userAnswer);
      }
    }
  }

  function havingSentAnAnswer() {
    return {
      to(quiz: Quiz) {
        quiz.submit(aUserAnswer());
      }
    }
  }

})
