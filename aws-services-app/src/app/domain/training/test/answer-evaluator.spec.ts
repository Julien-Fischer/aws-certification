import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {Answer} from "../models/answer";
import {expectResult} from "./expectations/expect-result";
import {aQuiz, QuizBuilder} from "./builders/quiz-builder";
import {aFalseStatement, aTrueStatement} from "./builders/question-builder";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {QuizRepository, quizRepositoryInjectionToken} from "../ports/outbound/quiz-repository";
import {AnswerEvaluator} from "../answer-evaluator";
import {anAnswer} from "./builders/answer-builder";

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

      expect(() => answerEvaluator.submit(unknownQuiz, anAnswer()))
        .toThrow(`Quiz with id 'unknown-quiz' not found`);
    })
  });

  describe('evaluation', () => {
    it('evaluates correct answers', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement().withExplanation('Explanation for question 1'),
            aFalseStatement().withExplanation('Explanation for question 2')
          )
      );

      const firstAnswer = answerEvaluator.submit(IAM_QUIZ, new Answer(true));

      expectResult(firstAnswer)
        .toBeCorrect()
        .toNotBeComplete()
        .toHaveProgress(50)
        .toHaveAccuracy(50)
        .toHaveExplanation('Explanation for question 1');

      const lastAnswer = answerEvaluator.submit(IAM_QUIZ, new Answer(false));

      expectResult(lastAnswer)
        .toBeCorrect()
        .toBeComplete()
        .toHaveProgress(100)
        .toHaveAccuracy(100)
        .toHaveExplanation('Explanation for question 2');
    })

    it('evaluates incorrect answers', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(aTrueStatement().withExplanation('Explanation for question 1'))
      );

      const result = answerEvaluator.submit(IAM_QUIZ, new Answer(false));

      expectResult(result)
        .toBeIncorrect()
        .toBeComplete()
        .toHaveAccuracy(0)
        .toHaveCorrectAnswer(true)
        .toHaveExplanation('Explanation for question 1');
    })
  })

  describe('saving', () => {
    it('saves current quiz state', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(aTrueStatement(), aFalseStatement())
      );

      answerEvaluator.submit(IAM_QUIZ, new Answer(true));

      const retrieved = quizRepository.get(IAM_QUIZ);

      expect(retrieved).toBeDefined();

      const result = retrieved!.submit(new Answer(false));

      expectResult(result)
        .toBeComplete()
        .toHaveAccuracy(100);
    })

  })

  function having(quiz: QuizBuilder) {
      quizRepository.save(quiz.build());
  }

})
