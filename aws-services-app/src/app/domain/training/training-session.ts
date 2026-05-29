import {Inject, Injectable} from "@angular/core";
import {QuizRepository, quizRepositoryInjectionToken} from "./ports/outbound/quiz-repository";
import {StartQuiz} from "./ports/inbound/start-quiz";
import {Quiz} from "./quiz";
import {NoShuffle, Shuffle} from "./shuffle";
import {Question} from "./models/question";

@Injectable({ providedIn: 'root' })
export class TrainingSession implements StartQuiz {

  constructor(
    @Inject(quizRepositoryInjectionToken) private quizRepository: QuizRepository
  ) { }

  with(questions: Question[], shuffle: Shuffle = NoShuffle): Quiz {
    const shuffled = this.shuffleAll(questions, shuffle);
    const quiz = new Quiz(shuffled);
    this.quizRepository.save(quiz);
    return quiz;
  }

  private shuffleAll(questions: Question[], shuffle: Shuffle): Question[] {
    return shuffle.shuffle(questions);
  }

}
