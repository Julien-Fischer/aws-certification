import {InjectionToken} from "@angular/core";
import {Question} from "../../models/question";
import {Shuffle} from "../../shuffle";
import {Quiz} from "../../quiz";

export const startQuizInjectionToken = new InjectionToken<StartQuiz>('StartQuiz');

export interface StartQuiz {

  with(questions: Question[], shuffle?: Shuffle): Quiz;

}
