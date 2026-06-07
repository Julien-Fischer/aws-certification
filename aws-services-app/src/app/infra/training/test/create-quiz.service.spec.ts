import {beforeEach, describe, expect, it} from "vitest";
import {TestBed} from "@angular/core/testing";
import {ShuffleProvider, shuffleProviderInjectionToken} from "../shuffle-provider";
import {NoShuffle, Shuffle} from "../../../domain/training/shuffle";
import {startQuizInjectionToken} from "../../../domain/training/ports/inbound/start-quiz";
import {TrainingSession} from "../../../domain/training/training-session";
import {quizRepositoryInjectionToken} from "../../../domain/training/ports/outbound/quiz-repository";
import {InMemoryQuizRepository} from "../in-memory-quiz-repository";
import {QuizId} from "../../../domain/training/quiz-id";
import {aUserAnswer} from "../../../domain/training/test/builders/answer-builder";
import {Quiz} from "../../../domain/training/quiz";
import {Option} from "../../../domain/search/models/question";
import {CreateQuiz, QuestionDto, QuizDto, QuizRequest} from "../create-quiz.service";

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

describe('CreateQuiz', () => {

  let quizPublisher: CreateQuiz;
  let shuffleProvider: ShuffleProvider;
  let mockShuffle: MockShuffle;
  let quizRepository: InMemoryQuizRepository;

  beforeEach(() => {
    mockShuffle = new MockShuffle();
    shuffleProvider = new DeterministicShuffleProvider(mockShuffle);
    quizRepository = new InMemoryQuizRepository();

    TestBed.configureTestingModule({
      providers: [
        {provide: shuffleProviderInjectionToken, useValue: shuffleProvider},
        {provide: startQuizInjectionToken, useClass: TrainingSession},
        {provide: quizRepositoryInjectionToken, useValue: quizRepository}
      ]
    });
    quizPublisher = TestBed.inject(CreateQuiz);
  });

  describe('shuffle', () => {
    it('does not shuffle by default', () => {
      const dto: QuizRequest = {
        booleanQuestions: [
          {label: 'statement 1', answer: true},
          {label: 'statement 2', answer: true}
        ],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']}
        ]
      }

      quizPublisher.publish(dto);

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
          {label: 'question 1', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']}
        ]
      }

      quizPublisher.publish(dto);

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
          {label: 'question 1', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']}
        ]
      }

      const quiz: QuizDto = quizPublisher.publish(dto);

      expect(quiz).toBeDefined();
      expect(quiz!.id).toBeDefined();
      expect(quiz.questions).toBe(4);
      expect(quiz.firstQuestion).toStrictEqual({label: 'statement 1'})
    })

    it('returns created quiz with a multiple choice question', () => {
      const dto: QuizRequest = {
        booleanQuestions: [],
        multipleChoiceQuestions: [
          {label: 'question 1', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']},
          {label: 'question 2', answer: {value: 'A. option 1'}, options: ['A. option 1', 'B. option 2']}
        ]
      }

      const quiz: QuizDto = quizPublisher.publish(dto);

      expect(quiz).toBeDefined();
      expect(quiz!.id).toBeDefined();
      expect(quiz.questions).toBe(2);
      const expectedFirstQuestion: QuestionDto = {
        label: 'question 1',
        options: [
          new Option('A. option 1'),
          new Option('B. option 2')
        ]
      };
      expect(quiz.firstQuestion).toStrictEqual(expectedFirstQuestion)
    })


    describe('lifecycle', () => {

      it('handles optional explanations', () => {
        const dto: QuizRequest = {
          booleanQuestions: [
            {label: 'statement 1', answer: true, explanation: 'Explanation 1'},
            {label: 'statement 2', answer: true}
          ],
          multipleChoiceQuestions: [
            {
              label: 'question 1',
              answer: {value: 'A. option 1', explanation: 'Explanation 3'},
              options: [
                'A. option 1',
                'B. option 2'
              ]
            },
            {
              label: 'question 2',
              answer: {value: 'A. option 1'},
              options: [
                'A. option 1',
                'B. option 2'
              ]
            }
          ]
        }

        const quiz: Quiz = havingPublished(dto);

        const result = quiz.submit(aUserAnswer());

        expect(result).toBeDefined();
        expect(result?.explanation).toBe('Explanation 1');
      })

      it('handles optional explanations', () => {
        const dto: QuizRequest = {
          booleanQuestions: [
            {label: 'statement 1', answer: true, explanation: 'Explanation 1'},
            {label: 'statement 2', answer: true}
          ],
          multipleChoiceQuestions: [
            {
              label: 'question 1',
              answer: {value: 'A. option 1', explanation: 'Explanation 3'},
              options: [
                'A. option 1',
                'B. option 2'
              ]
            },
            {
              label: 'question 2',
              answer: {value: 'A. option 1'},
              options: [
                'A. option 1',
                'B. option 2'
              ]
            }
          ]
        }

        const quiz: Quiz = havingPublished(dto);

        havingSentAnAnswerTo(quiz);
        havingSentAnAnswerTo(quiz);

        const result = quiz.submit(aUserAnswer());

        expect(result).toBeDefined();
        expect(result?.explanation).toBe('Explanation 3');
      })

    })

    function havingPublished(dto: QuizRequest): Quiz {
      const quiz: QuizDto = quizPublisher.publish(dto);
      return getPersistedQuiz(quiz.id);
    }

    function getPersistedQuiz(id: string): Quiz {
      const quiz = quizRepository.get(new QuizId(id));
      if (quiz == null) {
        throw new Error(`Quiz with id ${id} not found`);
      }
      return quiz;
    }

    function havingSentAnAnswerTo(quiz: Quiz) {
      quiz.submit(aUserAnswer());
    }

  })

});
