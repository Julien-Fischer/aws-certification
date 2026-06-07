import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {expectResult} from "./expectations/expect-result";
import {aQuiz, QuizBuilder} from "./builders/quiz-builder";
import {aFalseStatement, aSingleChoiceQuestion, aTrueStatement} from "./builders/question-builder";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {QuizRepository, quizRepositoryInjectionToken} from "../ports/outbound/quiz-repository";
import {AnswerEvaluator} from "../answer-evaluator";
import {aUserAnswer} from "./builders/answer-builder";

const IAM_QUIZ = new QuizId('IAM-1');

describe('AnswerEvaluator', () => {

  let answerEvaluator: AnswerEvaluator;
  let quizRepository: QuizRepository;

  beforeEach(() => {
    quizRepository = new InMemoryQuizRepository();

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: quizRepositoryInjectionToken, useValue: quizRepository }
      ]
    });
    answerEvaluator = TestBed.inject(AnswerEvaluator);
  });


  describe('retrieval', () => {
    it('throws when quiz is not found', () => {
      const unknownQuiz = new QuizId('unknown-quiz');

      expect(() => answerEvaluator.submit(unknownQuiz, aUserAnswer()))
        .toThrow(`Quiz with id 'unknown-quiz' not found`);
    })
  });

  describe('evaluation', () => {
    it('evaluates correct answers', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement(),
            aFalseStatement()
          )
      );

      const firstAnswer = answerEvaluator.submit(IAM_QUIZ, true);

      expectResult(firstAnswer)
        .toBeCorrect()
        .toNotBeComplete()
        .toHaveProgress(50)
        .toHaveAccuracy(50);

      const lastAnswer = answerEvaluator.submit(IAM_QUIZ, false);

      expectResult(lastAnswer)
        .toBeCorrect()
        .toBeComplete()
        .toHaveProgress(100)
        .toHaveAccuracy(100);
    })

    it('evaluates incorrect answers', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(aTrueStatement())
      );

      const result = answerEvaluator.submit(IAM_QUIZ, false);

      expectResult(result)
        .toBeIncorrect()
        .toBeComplete()
        .toHaveAccuracy(0)
        .toHaveCorrectAnswer(true);
    })
  })

  it('has an optional explanation', () => {
    having(
      aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement().withExplanation('Explanation for question 1'),
          aFalseStatement().withNoExplanation(),
          aSingleChoiceQuestion().withExplanation('Explanation for question 3'),
          aSingleChoiceQuestion().withNoExplanation()
        )
    );

    const first = answerEvaluator.submit(IAM_QUIZ, true);
    expectResult(first)
      .toHaveExplanation('Explanation for question 1');

    const second = answerEvaluator.submit(IAM_QUIZ, false);
    expectResult(second).toHaveNoExplanation();

    const third = answerEvaluator.submit(IAM_QUIZ, 'A');
    expectResult(third)
      .toHaveExplanation('Explanation for question 3');

    const fourth = answerEvaluator.submit(IAM_QUIZ, 'A');
    expectResult(fourth).toHaveNoExplanation();
  })

  describe('saving', () => {
    it('saves current quiz state', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(aTrueStatement(), aFalseStatement())
      );

      answerEvaluator.submit(IAM_QUIZ, true);

      const retrieved = quizRepository.get(IAM_QUIZ);

      expect(retrieved).toBeDefined();

      const result = retrieved!.submit(false);

      expectResult(result)
        .toBeComplete()
        .toHaveAccuracy(100);
    })

  })

  function having(quiz: QuizBuilder) {
      quizRepository.save(quiz.build());
  }

})
