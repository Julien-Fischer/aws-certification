import {Answer} from "../../models/answer";
import {Result} from "../../quiz";
import {InjectionToken} from "@angular/core";
import {QuizId} from "../../quiz-id";

export const submitAnswerInjectionToken = new InjectionToken<SubmitAnswer>('SubmitAnswer');

export interface SubmitAnswer {

  submit(quizId: QuizId, answer: Answer<any>): Result;

}
