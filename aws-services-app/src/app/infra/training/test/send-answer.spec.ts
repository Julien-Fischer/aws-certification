import {describe, it, expect, beforeEach} from 'vitest';
import {TestBed} from "@angular/core/testing";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";
import {AnswerDto, SendAnswer} from "../send-answer";
import {submitAnswerInjectionToken} from "../../../domain/training/ports/inbound/submit-answer";
import {AnswerEvaluator} from "../../../domain/training/answer-evaluator";

describe('SendAnswer', () => {

  let sendAnswer: SendAnswer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: submitAnswerInjectionToken, useClass: AnswerEvaluator},
        {provide: quizRepositoryInjectionToken, useClass: InMemoryQuizRepository}
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

  })

});
