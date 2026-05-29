import {beforeEach, describe, expect, it} from "vitest";
import {TestBed} from "@angular/core/testing";
import {SearchService} from "../../../domain/search/services/search.service";
import {QuizDto, QuizPublisher} from "../quiz-publisher.service";
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
        SearchService,
        {provide: shuffleProviderInjectionToken, useValue: shuffleProvider},
        {provide: startQuizInjectionToken, useClass: TrainingSession},
        {provide: quizRepositoryInjectionToken, useClass: InMemoryQuizRepository}
      ]
    });
    quizPublisher = TestBed.inject(QuizPublisher);
  });

  describe('start', () => {
    it('supports shuffling', () => {
      const dto: QuizDto = {
        booleanQuestions: [
          {label: 'statement 1', answer: true},
          {label: 'statement 2', answer: true}
        ],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'option 1'}, options: [{value: 'option 1'}, {value: 'option 2'}]},
          {label: 'question 2', answer: {value: 'option 1'}, options: [{value: 'option 1'}, {value: 'option 2'}]}],
        shuffle: true
      }

      quizPublisher.start(dto);

      expect(mockShuffle.wasCalled()).toBe(true);
    })
  })

});
