import {Inject, Injectable} from "@angular/core";
import {QuizRepository, quizRepositoryInjectionToken} from "./ports/outbound/quiz-repository";
import {StartQuiz} from "./ports/inbound/start-quiz";
import {Quiz} from "./quiz";

@Injectable({ providedIn: 'root' })
export class TrainingSession implements StartQuiz {

  constructor(
    @Inject(quizRepositoryInjectionToken) private quizRepository: QuizRepository
  ) { }

  start(quiz: Quiz): void {
    this.quizRepository.save(quiz);
  }

}
