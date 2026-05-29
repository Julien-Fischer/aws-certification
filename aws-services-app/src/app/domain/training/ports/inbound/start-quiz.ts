import {InjectionToken} from "@angular/core";
import {Quiz} from "../../quiz";

export const startQuizInjectionToken = new InjectionToken<StartQuiz>('StartQuiz');

export interface StartQuiz {

  start(quiz: Quiz): void;

}
