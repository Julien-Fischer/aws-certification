import {describe, it, expect, beforeEach} from 'vitest';
import {TestBed} from "@angular/core/testing";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";
import {AnswerDto, OutcomeDto, ResultDto, SendAnswer} from "../send-answer";
import {submitAnswerInjectionToken} from "../../../domain/training/ports/inbound/submit-answer";
import {AnswerEvaluator} from "../../../domain/training/answer-evaluator";
import {aQuiz, QuizBuilder} from "../../../domain/training/test/builders/quiz-builder";
import {QuizId} from "../../../domain/training/quiz-id";
import {aFalseStatement, aTrueStatement} from "../../../domain/training/test/builders/question-builder";

const IAM_QUIZ = new QuizId('IAM-1');

describe('SendAnswer', () => {

  let sendAnswer: SendAnswer;
  let quizRepository: InMemoryQuizRepository;

  beforeEach(() => {
    quizRepository = new InMemoryQuizRepository();
    TestBed.configureTestingModule({
      providers: [
        {provide: submitAnswerInjectionToken, useClass: AnswerEvaluator},
        {provide: quizRepositoryInjectionToken, useValue: quizRepository}
      ]
    });
    sendAnswer = TestBed.inject(SendAnswer);
  });

  describe('sends an answer', () => {
    it('throws when quiz not found', () => {
      const answerDto: AnswerDto = {quizId: 'unknown-quiz', answer: true};

      expect(() => sendAnswer.send(answerDto))
        .toThrow(`Quiz with id 'unknown-quiz' not found`);
    })

    it('receives result', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aFalseStatement()
        ));

      const answerDto: AnswerDto = {quizId: IAM_QUIZ.toString(), answer: false};

      const result = sendAnswer.send(answerDto);

      expectResult(result)
        .toHaveProgress(50)
        .toHaveAccuracy(0)
        .toHaveNoOutcome();
    })

    it('receives outcome', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aFalseStatement()
        ));

      sendAnswer.send({quizId: IAM_QUIZ.toString(), answer: false});
      const result = sendAnswer.send({quizId: IAM_QUIZ.toString(), answer: false});

      expectResult(result)
        .toHaveProgress(100)
        .toHaveAccuracy(50)
        .toHaveOutcome({
          hasFailed: false,
          hasSucceeded: true,
          hasMastered: false
        });
    })

    it('has mastered quiz if accuracy = 100%', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aFalseStatement()
        ));

      sendAnswer.send({quizId: IAM_QUIZ.toString(), answer: true});
      const result = sendAnswer.send({quizId: IAM_QUIZ.toString(), answer: false});

      expectResult(result)
        .toHaveProgress(100)
        .toHaveAccuracy(100)
        .toHaveOutcome({
          hasFailed: false,
          hasSucceeded: true,
          hasMastered: true
        });
    })
  })


  function having(quiz: QuizBuilder) {
    quizRepository.save(quiz.build());
  }

});

function expectResult(result: ResultDto) {
  return {
    toHaveAccuracy(value: number) {
      expect(result.accuracy).toBe(value);
      return this;
    },
    toHaveProgress(value: number) {
      expect(result.progress).toBe(value);
      return this;
    },
    toHaveNoOutcome() {
      expect(result.outcome).toBeUndefined();
      return this;
    },
    toHaveOutcome(param: OutcomeDto) {
      expect(result.outcome).toStrictEqual(param);
      return this;
    }
  }
}
