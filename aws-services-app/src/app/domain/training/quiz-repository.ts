import {Quiz} from "./quiz";
import {InjectionToken} from "@angular/core";
import {QuizId} from "./quiz-id";

export const quizRepositoryInjectionToken = new InjectionToken<QuizRepository>('QuizRepository');

export interface QuizRepository {

  save(quiz: Quiz): void;

  get(id: QuizId): Quiz | undefined;

}
