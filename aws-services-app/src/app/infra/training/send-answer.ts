import {Inject, Injectable} from "@angular/core";
import {SubmitAnswer, submitAnswerInjectionToken} from "../../domain/training/ports/inbound/submit-answer";
import {QuizId} from "../../domain/training/quiz-id";
import {Answer} from "../../domain/training/models/answer";
import {Result} from "../../domain/training/quiz";
import {Option} from "../../domain/training/models/multiple-choice-question";

export interface OutcomeDto {
  hasFailed: boolean;
  hasSucceeded: boolean;
  hasMastered: boolean;
}

export interface ResultDto {
  progress: number;
  accuracy: number;
  outcome?: OutcomeDto;
}

export interface AnswerDto {
  quizId: string;
  answer: string | boolean;
}

@Injectable({ providedIn: 'root' })
export class SendAnswer {

  constructor(
    @Inject(submitAnswerInjectionToken) private submitAnswer: SubmitAnswer
  ) { }

  send(userAnswer: AnswerDto): ResultDto {
    const id = new QuizId(userAnswer.quizId);
    const answer = toAnswer(userAnswer);
    const result = this.submitAnswer.submit(id, answer);
    return toDto(result);
  }

}

function toAnswer(answerDto: AnswerDto): Answer<any> {
  const value = typeof answerDto.answer === 'boolean'
    ? answerDto.answer
    : Option.from(answerDto.answer);
  return new Answer(value);
}



function toDto(result: Result): ResultDto {
  const {progress, accuracy, outcome} = result;
  const outcome2 = outcome == null ? undefined : {
    hasFailed: outcome.hasFailed(),
    hasSucceeded: outcome.hasSucceeded(),
    hasMastered: outcome.hasMastered()
  }
  return {
    progress: progress.value,
    accuracy: accuracy.value,
    outcome: outcome2
  };
}
