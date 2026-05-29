import {describe, it, expect, beforeEach} from 'vitest';
import {TestBed} from "@angular/core/testing";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";
import {OutcomeDto, ResultDto, SendAnswer} from "../send-answer";
import {submitAnswerInjectionToken} from "../../../domain/training/ports/inbound/submit-answer";
import {AnswerEvaluator} from "../../../domain/training/answer-evaluator";
import {aQuiz, QuizBuilder} from "../../../domain/training/test/builders/quiz-builder";
import {QuizId} from "../../../domain/training/quiz-id";
import {
  aFalseStatement,
  aMultipleChoiceQuestion,
  aTrueStatement
} from "../../../domain/training/test/builders/question-builder";

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
      expect(() => sendAnswer.send({quizId: 'unknown-quiz', answer: true}))
        .toThrow(`Quiz with id 'unknown-quiz' not found`);
    })

    it('receives result', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aMultipleChoiceQuestion(),
          aFalseStatement()
        ));

      havingSent(false).toQuiz(IAM_QUIZ);

      const result = send('A. Option 1').toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveProgress(66.66)
        .toHaveAccuracy(0)
        .toHaveNoOutcome();
    })

    it('receives outcome on quiz complete', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aFalseStatement()
        ));

      havingSent(false).toQuiz(IAM_QUIZ);

      const result = send(false).toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveProgress(100)
        .toHaveAccuracy(50)
        .toHaveNoNextQuestion()
        .toHaveOutcome({
          hasFailed: false,
          hasSucceeded: true,
          hasMastered: false
        })
    })

    describe('next question', () => {
      it('has next question as long as quiz is not complete', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement().labelled('question 1'),
            aFalseStatement().labelled('question 2'),
            aTrueStatement().labelled('question 3')
          ));

        const result1 = send(anAnswer()).toQuiz(IAM_QUIZ);
        const result2 = send(anAnswer()).toQuiz(IAM_QUIZ);
        const result3 = send(anAnswer()).toQuiz(IAM_QUIZ);

        expectResult(result1)
          .toHaveNextQuestion('question 2');
        expectResult(result2)
          .toHaveNextQuestion('question 3');
        expectResult(result3)
          .toHaveNoNextQuestion();
      })

      it('has no next question once quiz is complete', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement(),
            aFalseStatement()
          ));

        havingSent(anAnswer()).toQuiz(IAM_QUIZ);

        const result = send(anAnswer()).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toHaveNoNextQuestion();
      })
    })

    describe('outcomes', () => {
      it('has mastered quiz if accuracy = 100%', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement(),
            aFalseStatement()
          ));

        havingSent(true).toQuiz(IAM_QUIZ);

        const result = send(false).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toHaveProgress(100)
          .toHaveAccuracy(100)
          .toHaveOutcome({
            hasFailed: false,
            hasSucceeded: true,
            hasMastered: true
          });
      })

      it('has succeeded quiz if accuracy >= 50%', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement(),
            aFalseStatement()
          ));

        havingSent(false).toQuiz(IAM_QUIZ);

        const result = send(false).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toHaveProgress(100)
          .toHaveAccuracy(50)
          .toHaveOutcome({
            hasFailed: false,
            hasSucceeded: true,
            hasMastered: false
          });
      })

      it('has failed quiz if accuracy < 50%', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement(),
            aFalseStatement(),
            aTrueStatement(),
          ));

        havingSent(false).toQuiz(IAM_QUIZ);
        havingSent(false).toQuiz(IAM_QUIZ);

        const result = send(false).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toHaveProgress(100)
          .toHaveAccuracy(33.33)
          .toHaveOutcome({
            hasFailed: true,
            hasSucceeded: false,
            hasMastered: false
          });
      })
    })
  })


  function having(quiz: QuizBuilder) {
    quizRepository.save(quiz.build());
  }

  function havingSent(answer: boolean | string) {
    return send(answer);
  }

  function send(answer: boolean | string) {
    return {
      toQuiz(quizId: QuizId) {
        return sendAnswer.send({quizId: quizId.toString(), answer});
      }
    }
  }

});

function expectResult(result: ResultDto) {
  return {
    toHaveAccuracy(value: number) {
      expect(result.accuracy).toBeCloseTo(value, 0);
      return this;
    },
    toHaveProgress(value: number) {
      expect(result.progress).toBeCloseTo(value, 0);
      return this;
    },
    toHaveNoOutcome() {
      expect(result.outcome).toBeUndefined();
      return this;
    },
    toHaveOutcome(param: OutcomeDto) {
      expect(result.outcome).toStrictEqual(param);
      return this;
    },
    toHaveNoNextQuestion() {
      expect(result.nextQuestion).toBeUndefined();
      return this;
    },
    toHaveNextQuestion(label: string) {
      expect(result.nextQuestion).toBe(label);
      return this;
    }
  }
}

function anAnswer(): string | boolean {
  return 'A. Option 1';
}
