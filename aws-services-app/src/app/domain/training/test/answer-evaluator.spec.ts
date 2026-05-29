import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {Answer} from "../models/answer";
import {expectResult} from "./expectations/expect-result";
import {aQuiz, QuizBuilder} from "./builders/quiz-builder";
import {aFalseStatement, aTrueStatement} from "./builders/question-builder";
import {MockFlashCardProvider} from "../../search/test/mock-flashcard-provider";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {flashCardProviderInjectionToken} from "../../search/flash-card-provider";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {QuizRepository, quizRepositoryInjectionToken} from "../quiz-repository";
import {AnswerEvaluator} from "../answer-evaluator";
import {submitAnswerInjectionToken} from "../submit-answer";

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


  describe('evaluation', () => {
    it('evaluates correct answers', () => {
      having(
        aQuiz()
          .identified(IAM_QUIZ)
          .with(aTrueStatement(), aFalseStatement())
      );

      const firstAnswer = answerEvaluator.submit(IAM_QUIZ, new Answer(true));

      expectResult(firstAnswer)
        .toBeCorrect()
        .toNotBeComplete()
        .toHaveProgress(50)
        .toHaveAccuracy(50);

      const lastAnswer = answerEvaluator.submit(IAM_QUIZ, new Answer(false));

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

      const result = answerEvaluator.submit(IAM_QUIZ, new Answer(false));

      expectResult(result)
        .toBeIncorrect()
        .toBeComplete()
        .toHaveAccuracy(0)
        .toHaveCorrectAnswer(true);
    })
  })

  function having(quiz: QuizBuilder) {
      quizRepository.save(quiz.build());
  }

})


function aQuizId(): QuizId {
  return QuizId.random();
}
