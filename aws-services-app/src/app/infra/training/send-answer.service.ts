import {Inject, Injectable} from "@angular/core";
import {SubmitAnswer, submitAnswerInjectionToken} from "../../domain/training/ports/inbound/submit-answer";
import {QuizId} from "../../domain/training/quiz-id";
import {QuizOutcome, Result} from "../../domain/training/quiz";
import {Question} from "../../domain/training/models/questions/question";
import {UserAnswer} from "../../domain/training/models/user-answer";
import {Option} from "../../domain/training/models/option";
import {ExpectedAnswer} from "../../domain/training/models/answers/expected-answer";
import {MultipleChoiceQuestion} from "../../domain/training/models/questions/multiple-choice-question";
import {BooleanQuestion} from "../../domain/training/models/questions/boolean-question";
import {SingleChoiceQuestion} from "../../domain/training/models/questions/single-choice-question";

export type ExpectedAnswerDto = boolean | string | string[];

export interface OutcomeDto {
  hasFailed: boolean;
  hasSucceeded: boolean;
  hasMastered: boolean;
}

export interface ResultDto {
  isAnswerCorrect: boolean;
  expectedAnswer: ExpectedAnswerDto;
  explanation?: string;
  progress: number;
  accuracy: number;
  outcome?: OutcomeDto;
  nextQuestion?: NextQuestionDto;
}

export interface AnswerDto {
  quizId: string;
  answer: UserAnswer;
}

export interface NextQuestionDto {
  label: string;
  options?: {
    allowMultipleSelection: boolean,
    values: string[]
  }
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
    nextQuestion: toNextQuestion(nextQuestion),
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

function toNextQuestion(nextQuestion?: Question): NextQuestionDto | undefined {
  if (nextQuestion == null) {
    return undefined;
  }

  const dto: Partial<NextQuestionDto> = {
    label: nextQuestion.label
  };

  const isBooleanQuestion = nextQuestion instanceof BooleanQuestion;

  if (isBooleanQuestion) {
    return dto as NextQuestionDto;
  }

  const isSingleChoiceQuestion = nextQuestion instanceof SingleChoiceQuestion;
  const isMultipleChoiceQuestion = nextQuestion instanceof MultipleChoiceQuestion;

  if (isSingleChoiceQuestion || isMultipleChoiceQuestion) {
    dto.options = {
      allowMultipleSelection: isMultipleChoiceQuestion,
      values: nextQuestion.options.map(option => option.toString())
    }
  }

  return dto as NextQuestionDto;
}

function toExpectedAnswer(expectedAnswer: ExpectedAnswer<any>): ExpectedAnswerDto {
  if (Array.isArray(expectedAnswer.value)) {
    return expectedAnswer.value.map(value => value.prefix);
  }
  return expectedAnswer.value instanceof Option
    ? expectedAnswer.value.prefix
    : expectedAnswer.value;
}
