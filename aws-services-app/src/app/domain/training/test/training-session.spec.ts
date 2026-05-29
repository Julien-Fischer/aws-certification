import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {QuizRepository, quizRepositoryInjectionToken} from "../ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {TrainingSession} from "../training-session";
import {aQuiz} from "./builders/quiz-builder";
import {aQuestion} from "./builders/question-builder";

const IAM_QUIZ = new QuizId('IAM-1');

describe('AnswerEvaluator', () => {

  let trainingSession: TrainingSession;
  let quizRepository: QuizRepository;

  beforeEach(() => {
    quizRepository = new InMemoryQuizRepository();

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: quizRepositoryInjectionToken, useValue: quizRepository }
      ]
    });
    trainingSession = TestBed.inject(TrainingSession);
  });

  describe('start', () => {
    it('starts a new training session', () => {
      const quiz = aQuiz()
        .identified(IAM_QUIZ)
        .with(aQuestion(), aQuestion())
        .build();

      trainingSession.start(quiz);

      let retrieved = quizRepository.get(IAM_QUIZ);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(IAM_QUIZ);
      expect(retrieved!.length).toBe(2);
    })
  })

})
