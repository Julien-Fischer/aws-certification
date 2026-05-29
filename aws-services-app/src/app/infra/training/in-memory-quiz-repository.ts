import {QuizRepository} from "../../domain/training/quiz-repository";
import {Quiz} from "../../domain/training/quiz";
import {Injectable} from "@angular/core";
import {QuizId} from "../../domain/training/quiz-id";

@Injectable({ providedIn: 'root' })
export class InMemoryQuizRepository implements QuizRepository {

  private quizzes: Map<QuizId, Quiz> = new Map();

  get(id: QuizId): Quiz | undefined {
    return this.quizzes.get(id);
  }

  save(quiz: Quiz): void {
    this.quizzes.set(quiz.id, quiz);
  }

}
