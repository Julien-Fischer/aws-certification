import {describe, it, expect, beforeEach} from "vitest";
import {QuizId} from "../quiz-id";
import {QuizRepository, quizRepositoryInjectionToken} from "../ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {TrainingSession} from "../training-session";
import {aFalseStatement, aMultipleChoiceQuestion, aQuestion, aTrueStatement} from "./builders/question-builder";
import {Answer} from "../models/answer";
import {expectResult} from "./expectations/expect-result";
import {Shuffle} from "../shuffle";
import {MultipleChoiceQuestion} from "../models/multiple-choice-question";
import {Question} from "../models/question";

describe('AnswerEvaluator', () => {

  let startQuiz: TrainingSession;
  let quizRepository: QuizRepository;

  beforeEach(() => {
    quizRepository = new InMemoryQuizRepository();

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: quizRepositoryInjectionToken, useValue: quizRepository }
      ]
    });
    startQuiz = TestBed.inject(TrainingSession);
  });

  describe('start', () => {
    it('starts a new training session', () => {
      const questions = [anyQuestion(), anyQuestion()];

      const quiz = startQuiz.with(questions);

      const retrieved = quizRepository.get(quiz.id);
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(quiz.id);
      expect(retrieved!.length).toBe(2);
    })
  })

  describe('shuffle', () => {
    describe('boolean', () => {
      it('shuffles questions', () => {
        const questions = [
          aTrueStatement().build(),
          aFalseStatement().build()
        ];

        const quiz = startQuiz.with(questions, reverseOrder());

        const answer1 = quiz.submit(new Answer(false));
        expectResult(answer1).toBeCorrect();

        const answer2 = quiz.submit(new Answer(true));
        expectResult(answer2).toBeCorrect();
      })
    })

    describe('multiple choice', () => {
      it('shuffles questions', () => {
        const questions = [
          aQuestionWithAnswer('A. First option'),
          aQuestionWithAnswer('B. Second option'),
          aQuestionWithAnswer('C. Third option')
        ];

        const quiz = startQuiz.with(questions, reverseOrder());

        const answer1 = quiz.submit(new Answer('C. Third option'));
        expectResult(answer1).toBeCorrect();

        const answer2 = quiz.submit(new Answer('B. Second option'));
        expectResult(answer2).toBeCorrect();

        const answer3 = quiz.submit(new Answer('A. First option'));
        expectResult(answer3).toBeCorrect();
      })
    })
  })

})

function reverseOrder(): Shuffle {
  return {
    shuffle<T>(array: T[]): T[] {
      return array.slice().reverse();
    }
  }
}

function aQuestionWithAnswer(answerText: string): MultipleChoiceQuestion {
  return aMultipleChoiceQuestion()
    .withAnswer(answerText)
    .build();
}

function anyQuestion(): Question {
  return aQuestion().build();
}
