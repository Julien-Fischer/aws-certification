import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {Answer} from "../models/answer";
import {expectResult} from "./expectations/expect-result";
import {aQuiz, QuizBuilder} from "./builders/quiz-builder";
import {aTrueStatement} from "./builders/question-builder";
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

  it('evaluates correct answers', () => {
    having(
      aQuiz()
        .identified(IAM_QUIZ)
        .with(aTrueStatement())
    );

    const result = answerEvaluator.submit(IAM_QUIZ, new Answer(true));

    expectResult(result).toBeCorrect();
  })

  function having(quiz: QuizBuilder) {
      quizRepository.save(quiz.build());
  }

})


function aQuizId(): QuizId {
  return QuizId.random();
}
