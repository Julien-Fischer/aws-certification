import {describe, it, expect, beforeEach} from 'vitest';
import {TestBed} from "@angular/core/testing";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";
import {NextQuestionDto, OutcomeDto, ResultDto, SendAnswer} from "../send-answer.service";
import {submitAnswerInjectionToken} from "../../../domain/training/ports/inbound/submit-answer";
import {AnswerEvaluator} from "../../../domain/training/answer-evaluator";
import {aQuiz, QuizBuilder} from "../../../domain/training/test/builders/quiz-builder";
import {QuizId} from "../../../domain/training/quiz-id";
import {
  aFalseStatement, aMultipleChoiceQuestion,
  aSingleChoiceQuestion,
  aTrueStatement
} from "../../../domain/training/test/builders/question-builder";
import {anOption} from "../../../domain/training/test/builders/option-builder";
import {aUserAnswer} from "../../../domain/training/test/builders/answer-builder";
import {UserAnswer} from "../../../domain/training/models/user-answer";

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


  it('throws when quiz not found', () => {
    expect(() => sendAnswer.send({quizId: 'unknown-quiz', answer: true}))
      .toThrow(`Quiz with id 'unknown-quiz' not found`);
  })

  describe('multiple choice evaluation', () => {
    it('is correct when prefix is correct', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aSingleChoiceQuestion()
            .withAnswer('C. Option 3')
            .withOptions(
              anOption().withValue('A. Option 1'),
              anOption().withValue('B. Option 2'),
              anOption().withValue('C. Option 3'),
              anOption().withValue('D. Option 4')
            )
        ));

      const result = send('C').toQuiz(IAM_QUIZ);

      expectResult(result)
        .toBeCorrect()
        .toHaveExpectedAnswer('C');
    })

    it('is incorrect when prefix is incorrect', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aSingleChoiceQuestion()
            .withAnswer('C. Option 3')
            .withOptions(
              anOption().withValue('A. Option 1'),
              anOption().withValue('B. Option 2'),
              anOption().withValue('C. Option 3'),
              anOption().withValue('D. Option 4')
            )
        ));

      const result = send('A').toQuiz(IAM_QUIZ);

      expectResult(result)
        .toBeIncorrect()
        .toHaveExpectedAnswer('C');
    })
  })

  describe('sends explanation regardless of answer being correct', () => {
    describe('multiple-choice question', () => {
      it('is correct', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aSingleChoiceQuestion()
              .withAnswer('C. Option 3').withExplanation('Correct answer explanation')
              .withOptions(
                anOption().withValue('A. Option 1'),
                anOption().withValue('B. Option 2'),
                anOption().withValue('C. Option 3'),
                anOption().withValue('D. Option 4')
              )
          ));

        const result = send('C').toQuiz(IAM_QUIZ);

        expectResult(result)
          .toBeCorrect()
          .toHaveExplanation('Correct answer explanation');
      })

      it('is incorrect', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aSingleChoiceQuestion()
              .withAnswer('C. Option 3').withExplanation('Incorrect answer explanation')
              .withOptions(
                anOption().withValue('A. Option 1'),
                anOption().withValue('B. Option 2'),
                anOption().withValue('C. Option 3'),
                anOption().withValue('D. Option 4')
              )
          ));

        const result = send('B').toQuiz(IAM_QUIZ);

        expectResult(result)
          .toBeIncorrect()
          .toHaveExplanation('Incorrect answer explanation');
      })
    })

    describe('boolean question', () => {
      it('is correct', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement().withExplanation('Answer explanation')
          ));

        const result = send(true).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toBeCorrect()
          .toHaveExplanation('Answer explanation');
      })
    })

    describe('Explanation is optional', () => {
      it('multiple-choice', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aSingleChoiceQuestion().withNoExplanation()
              .withOptions(
                anOption()
                  .withValue('A. Option 1')
              )
          ));

        const result = send('A').toQuiz(IAM_QUIZ);

        expectResult(result)
          .toBeCorrect()
          .toHaveNoExplanation();
      })

      it('boolean', () => {
        having(aQuiz()
          .identified(IAM_QUIZ)
          .with(
            aTrueStatement().withNoExplanation()
          ));

        const result = send(true).toQuiz(IAM_QUIZ);

        expectResult(result)
          .toBeCorrect()
          .toHaveNoExplanation();
      })
    })
  });

  describe('result and outcome', () => {
    it('receives result', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement(),
          aSingleChoiceQuestion(),
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

      const result1 = send(aUserAnswer()).toQuiz(IAM_QUIZ);
      const result2 = send(aUserAnswer()).toQuiz(IAM_QUIZ);
      const result3 = send(aUserAnswer()).toQuiz(IAM_QUIZ);

      expectResult(result1)
        .toHaveNextQuestion().labelled('question 2');
      expectResult(result2)
        .toHaveNextQuestion().labelled('question 3');
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

      havingSent(aUserAnswer()).toQuiz(IAM_QUIZ);

      const result = send(aUserAnswer()).toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveNoNextQuestion();
    })

    it('next question has no option when boolean statement', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement().labelled('question 1'),
          aFalseStatement().labelled('question 2'),
        ));

      const result = send(aUserAnswer()).toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveNextQuestion().toHaveNoOptions();
    })

    it('next question has options when single-choice question', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement().labelled('question 1'),
          aSingleChoiceQuestion().labelled('question 2').withOptions(
            anOption().withValue('A. Option 1'),
            anOption().withValue('B. Option 2'),
            anOption().withValue('C. Option 3'),
            anOption().withValue('D. Option 4')
          ),
        ));

      const result = send(aUserAnswer()).toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveNextQuestion()
        .toHaveOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4')
        .toRequireSingleSelection();
    })

    it('next question has options when multiple-choice question', () => {
      having(aQuiz()
        .identified(IAM_QUIZ)
        .with(
          aTrueStatement().labelled('question 1'),
          aMultipleChoiceQuestion().labelled('question 2').withOptions(
            anOption().withValue('A. Option 1'),
            anOption().withValue('B. Option 2'),
            anOption().withValue('C. Option 3'),
            anOption().withValue('D. Option 4')
          ),
        ));

      const result = send(aUserAnswer()).toQuiz(IAM_QUIZ);

      expectResult(result)
        .toHaveNextQuestion()
        .toHaveOptions('A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4')
        .toAllowMultipleSelection();
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


  function having(quiz: QuizBuilder) {
    quizRepository.save(quiz.build());
  }

  function havingSent(answer: UserAnswer) {
    return send(answer);
  }

  function send(answer: UserAnswer) {
    return {
      toQuiz(quizId: QuizId) {
        return sendAnswer.send({quizId: quizId.toString(), answer});
      }
    }
  }


  function expectResult(result: ResultDto) {
    return {
      toBeCorrect() {
        expect(result.isAnswerCorrect).toBe(true);
        return this;
      },
      toBeIncorrect() {
        expect(result.isAnswerCorrect).toBe(false);
        return this;
      },
      toHaveExpectedAnswer(answer: boolean | string) {
        expect(result.expectedAnswer).toBe(answer);
        return this;
      },
      toHaveExplanation(explanation: string) {
        expect(result.explanation).toBe(explanation);
        return this;
      },
      toHaveNoExplanation() {
        expect(result.explanation).toBeUndefined();
        return this;
      },
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
      toHaveNextQuestion(): NextQuestionExpectation {
        return new NextQuestionExpectation(result.nextQuestion);
      }
    }
  }

});

class NextQuestionExpectation {

  constructor(private nextQuestion?: NextQuestionDto) { }

  labelled(label: string): this {
    expect(this.nextQuestion?.label).toBe(label);
    return this;
  }

  toHaveNoOptions(): this {
    expect(this.nextQuestion?.options).toBeUndefined();
    return this;
  }

  toHaveOptions(...options: string[]): this {
    expect(this.nextQuestion?.options?.values).toStrictEqual(options);
    return this;
  }

  toAllowMultipleSelection(): this {
    expect(this.nextQuestion?.options?.allowMultipleSelection).toBe(true);
    return this;
  }

  toRequireSingleSelection(): this {
    expect(this.nextQuestion?.options?.allowMultipleSelection).toBe(false);
    return this;
  }

}
