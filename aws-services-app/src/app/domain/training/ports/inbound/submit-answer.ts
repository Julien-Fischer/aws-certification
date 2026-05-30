import {Result} from "../../quiz";
import {InjectionToken} from "@angular/core";
import {QuizId} from "../../quiz-id";
import {UserAnswer} from "../../models/user-answer";

export const submitAnswerInjectionToken = new InjectionToken<SubmitAnswer>('SubmitAnswer');

export interface SubmitAnswer {

  submit(quizId: QuizId, answer: UserAnswer): Result;

}
