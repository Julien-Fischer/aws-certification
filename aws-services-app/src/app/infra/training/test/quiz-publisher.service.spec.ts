import {beforeEach, describe, expect, it} from "vitest";
import {TestBed} from "@angular/core/testing";
import {QuizRequest, QuizPublisher, QuizDto} from "../quiz-publisher.service";
import {ShuffleProvider, shuffleProviderInjectionToken} from "../shuffle-provider";
import {NoShuffle, Shuffle} from "../../../domain/training/shuffle";
import {startQuizInjectionToken} from "../../../domain/training/ports/inbound/start-quiz";
import {TrainingSession} from "../../../domain/training/training-session";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";

class DeterministicShuffleProvider implements ShuffleProvider {

  constructor(private deterministicShuffle: Shuffle) { }

  get(shuffle: boolean): Shuffle {
    return shuffle ? this.deterministicShuffle : NoShuffle;
  }

}

class MockShuffle implements Shuffle {

  private called = false;

  shuffle<T>(array: T[]): T[] {
    this.called = true;
    return array;
  }

  wasCalled(): boolean {
    return this.called;
  }

}

describe('QuizPublisher', () => {

  let quizPublisher: QuizPublisher;
  let shuffleProvider: ShuffleProvider;
  let mockShuffle: MockShuffle;

  beforeEach(() => {
    mockShuffle = new MockShuffle();
    shuffleProvider = new DeterministicShuffleProvider(mockShuffle);

    TestBed.configureTestingModule({
      providers: [
        {provide: shuffleProviderInjectionToken, useValue: shuffleProvider},
        {provide: startQuizInjectionToken, useClass: TrainingSession},
        {provide: quizRepositoryInjectionToken, useClass: InMemoryQuizRepository}
      ]
    });
    quizPublisher = TestBed.inject(QuizPublisher);
  });

  describe('shuffle', () => {
    it('does not shuffle by default', () => {
      const dto: QuizRequest = {
        booleanQuestions: [
          {label: 'statement 1', answer: true},
          {label: 'statement 2', answer: true}
        ],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]}
        ]
      }

      quizPublisher.start(dto);

      expect(mockShuffle.wasCalled()).toBe(false);
    })

    it('supports shuffling', () => {
      const dto: QuizRequest = {
        shuffle: true,
        booleanQuestions: [
          {label: 'statement 1', answer: true},
          {label: 'statement 2', answer: true}
        ],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]}
        ]
      }

      quizPublisher.start(dto);

      expect(mockShuffle.wasCalled()).toBe(true);
    })
  })

  describe('start', () => {
    it('returns created quiz with boolean questions first', () => {
      const dto: QuizRequest = {
        booleanQuestions: [
          {label: 'statement 1', answer: true},
          {label: 'statement 2', answer: true}
        ],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]}
        ]
      }

      const quiz: QuizDto = quizPublisher.start(dto);

      expect(quiz).toBeDefined();
      expect(quiz!.id).toBeDefined();
      expect(quiz.questions).toBe(4);
      expect(quiz.firstQuestion).toStrictEqual({label: 'statement 1'})
    })

    it('returns created quiz with a multiple choice question', () => {
      const dto: QuizRequest = {
        booleanQuestions: [],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: [{value: 'A. option 1'}, {value: 'B. option 2'}]}
        ]
      }

      const quiz: QuizDto = quizPublisher.start(dto);

      expect(quiz).toBeDefined();
      expect(quiz!.id).toBeDefined();
      expect(quiz.questions).toBe(2);
      expect(quiz.firstQuestion).toStrictEqual({label: 'question 1', options: ['A. option 1', 'B. option 2']})
    })
  })

});
