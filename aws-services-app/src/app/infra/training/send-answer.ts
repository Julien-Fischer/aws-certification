import {Inject, Injectable} from "@angular/core";
import {SubmitAnswer, submitAnswerInjectionToken} from "../../domain/training/ports/inbound/submit-answer";
import {QuizId} from "../../domain/training/quiz-id";
import {Answer} from "../../domain/training/models/answer";
import {QuizOutcome, Result} from "../../domain/training/quiz";
import {Option} from "../../domain/training/models/multiple-choice-question";
import {Question} from "../../domain/training/models/question";

export interface OutcomeDto {
  hasFailed: boolean;
  hasSucceeded: boolean;
  hasMastered: boolean;
}

export interface ResultDto {
  progress: number;
  accuracy: number;
  outcome?: OutcomeDto;
  nextQuestion?: string;
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
  const {progress, accuracy, nextQuestion, outcome} = result;
  return {
    progress: progress.value,
    accuracy: accuracy.value,
    nextQuestion: nextQuestionText(nextQuestion),
    outcome: toOutcomeDto(outcome)
  };
}

function toOutcomeDto(outcome?: QuizOutcome): OutcomeDto | undefined {
  return outcome == null ? undefined : {
    hasFailed: outcome.hasFailed(),
    hasSucceeded: outcome.hasSucceeded(),
    hasMastered: outcome.hasMastered()
  };
}

function nextQuestionText(nextQuestion?: Question): string | undefined {
  return nextQuestion == null ? undefined : nextQuestion.label;
}
