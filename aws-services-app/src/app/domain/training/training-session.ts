import {Inject, Injectable} from "@angular/core";
import {QuizRepository, quizRepositoryInjectionToken} from "./ports/outbound/quiz-repository";
import {StartQuiz} from "./ports/inbound/start-quiz";
import {Quiz} from "./quiz";
import {FisherYatesShuffle, Shuffle} from "./shuffle";
import {Question} from "./models/question";
import {MultipleChoiceQuestion} from "./models/multiple-choice-question";

@Injectable({ providedIn: 'root' })
export class TrainingSession implements StartQuiz {

  constructor(
    @Inject(quizRepositoryInjectionToken) private quizRepository: QuizRepository
  ) { }

  with(questions: Question[], shuffle: Shuffle = FisherYatesShuffle): Quiz {
    const shuffled = this.shuffleAll(questions, shuffle);
    const quiz = new Quiz(shuffled);
    this.quizRepository.save(quiz);
    return quiz;
  }

  private shuffleAll(questions: Question[], strategy: Shuffle): Question[] {
    const shuffled = strategy.shuffle(questions);
    for (let question of shuffled) {
      if (question instanceof MultipleChoiceQuestion) {
        question.shuffle(question.options, strategy);
      }
    }
    return shuffled;
  }

}
