import {Inject, Injectable} from "@angular/core";
import {SubmitAnswer, submitAnswerInjectionToken} from "../../domain/training/ports/inbound/submit-answer";
import {QuizId} from "../../domain/training/quiz-id";
import {QuizOutcome, Result} from "../../domain/training/quiz";
import {Question} from "../../domain/training/models/question";
import {UserAnswer} from "../../domain/training/models/user-answer";
import {ExpectedAnswer} from "../../domain/training/models/expected-answer";
import {Option} from "../../domain/training/models/option";

export interface OutcomeDto {
  hasFailed: boolean;
  hasSucceeded: boolean;
  hasMastered: boolean;
}

export interface ResultDto {
  isAnswerCorrect: boolean;
  expectedAnswer: boolean | string | string[];
  explanation?: string;
  progress: number;
  accuracy: number;
  outcome?: OutcomeDto;
  nextQuestion?: string;
}

export interface AnswerDto {
  quizId: string;
  answer: UserAnswer;
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

function toAnswer(answerDto: AnswerDto): UserAnswer {
  return answerDto.answer;
}

function toDto(result: Result): ResultDto {
  const {isAnswerCorrect, expectedAnswer, explanation, progress, accuracy, nextQuestion, outcome} = result;
  return {
    isAnswerCorrect,
    expectedAnswer: toExpectedAnswer(expectedAnswer),
    explanation,
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

function toExpectedAnswer(expectedAnswer: ExpectedAnswer<any>): string | boolean {
  return expectedAnswer.value instanceof Option
    ? expectedAnswer.value.prefix
    : expectedAnswer.value;
}
