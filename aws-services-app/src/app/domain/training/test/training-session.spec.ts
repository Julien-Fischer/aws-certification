import {describe, it, expect, beforeEach} from "vitest";
import {QuizRepository, quizRepositoryInjectionToken} from "../ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../../../infra/training/in-memory-quiz-repository";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../search/services/search.service";
import {TrainingSession} from "../training-session";
import {aFalseStatement, aSingleChoiceQuestion, aQuestion, aTrueStatement} from "./builders/question-builder";
import {expectResult} from "./expectations/expect-result";
import {Shuffle} from "../shuffle";
import {SingleChoiceQuestion} from "../models/questions/single-choice-question";
import {Question} from "../models/questions/question";
import {anOption} from "./builders/option-builder";

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

        const answer1 = quiz.submit(false);
        expectResult(answer1).toBeCorrect();

        const answer2 = quiz.submit(true);
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

        const shuffled: SingleChoiceQuestion[] = cast(quiz.questions());
        const answers = shuffled.map(question => question.answer.toString());

        expect(answers).toEqual([
          'C. Third option',
          'B. Second option',
          'A. First option',
        ]);
      })

      it('shuffles questions and their options', () => {
        const questions = [
          aSingleChoiceQuestion().withAnswer('A. IAM Question Answer')
            .withOptions(
              anOption().withValue('A. IAM Question Answer'),
              anOption().withValue('B. IAM Question Option 2'),
            ).build(),
          aSingleChoiceQuestion().withAnswer('B. EC2 Question Answer')
            .withOptions(
              anOption().withValue('A. EC2 Question Option 1'),
              anOption().withValue('B. EC2 Question Answer'),
            ).build()
        ];

        const quiz = startQuiz.with(questions, reverseOrder());

        const shuffled: SingleChoiceQuestion[] = cast(quiz.questions());
        const answers = shuffled.map(question => question.answer.toString());
        const ec2Options = optionNames(shuffled[0]);
        const iamOptions = optionNames(shuffled[1]);

        expect(answers).toEqual(['B. EC2 Question Answer', 'A. IAM Question Answer']);
        expect(ec2Options).toEqual(['B', 'A']);
        expect(iamOptions).toEqual(['B', 'A']);
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

function aQuestionWithAnswer(answerText: string): SingleChoiceQuestion {
  return aSingleChoiceQuestion()
    .withAnswer(answerText)
    .build();
}

function anyQuestion(): Question {
  return aQuestion().build();
}

function cast<T>(value: any): T {
  return value as T;
}

function optionNames(question: SingleChoiceQuestion): string[] {
  return question.options.map(option => option.prefix);
}
