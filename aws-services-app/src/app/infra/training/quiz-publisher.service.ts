import {Inject, Injectable} from "@angular/core";
import {StartQuiz, startQuizInjectionToken} from "../../domain/training/ports/inbound/start-quiz";
import {Question} from "../../domain/training/models/question";
import {BooleanQuestion} from "../../domain/training/models/boolean-question";
import {MultipleChoiceQuestion, Option} from "../../domain/training/models/multiple-choice-question";
import {ShuffleProvider, shuffleProviderInjectionToken} from "./shuffle-provider";
import {Quiz} from "../../domain/training/quiz";
import {ExpectedAnswer} from "../../domain/training/models/expected-answer";

export interface QuizDto {
  id: string;
  questions: number;
  firstQuestion: QuestionDto;
}

export interface QuestionDto {
  label: string;
  options?: string[];
}

export interface QuizRequest {
  booleanQuestions: BooleanQuestionDto[],
  multipleChoiceQuestions: MultipleChoiceQuestionDto[],
  shuffle?: boolean
}

interface BooleanQuestionDto {
  label: string;
  answer: boolean;
}

interface MultipleChoiceQuestionDto {
  label: string;
  answer: OptionDto;
  options: OptionDto[];
}

interface OptionDto {
  value: string;
  explanation?: string;
}

@Injectable({ providedIn: 'root' })
export class QuizPublisher {

  constructor(
    @Inject(startQuizInjectionToken) private startQuiz: StartQuiz,
    @Inject(shuffleProviderInjectionToken) private shuffleProvider: ShuffleProvider,
  ) { }

  start(quizDto: QuizRequest): QuizDto {
    const questions = this.toQuestions(quizDto);
    const quiz = this.startQuiz.with(questions, this.shuffleProvider.get(quizDto.shuffle ?? false));
    return response(quiz);
  }

  private toQuestions(dto: QuizRequest): Question[] {
    return [
      ...mapBoolean(dto.booleanQuestions),
      ...mapMultipleChoice(dto.multipleChoiceQuestions)
    ];
  }

}

function mapBoolean(questions: BooleanQuestionDto[]): Question[] {
  return questions
    .map(question => new BooleanQuestion(
      question.label,
      new ExpectedAnswer<boolean>(question.answer)
    ));
}

function mapMultipleChoice(questions: MultipleChoiceQuestionDto[]): Question[] {
  return questions
    .map(question => new MultipleChoiceQuestion(
      question.label,
      new ExpectedAnswer<Option>(mapOption(question.answer)),
      mapOptions(question.options)
    ));
}

function mapOptions(optionDtos: OptionDto[]): Option[] {
  return optionDtos.map(mapOption);
}

function mapOption(optionDto: OptionDto): Option {
  return Option.from(optionDto.value, optionDto.explanation);
}

function response(quiz: Quiz): QuizDto {
  return {
    id: quiz.id.toString(),
    questions: quiz.length,
    firstQuestion: toQuestionDto(quiz.questions()[0])
  };
}

function toQuestionDto(question: Question): QuestionDto {
  const questionDto: Partial<QuestionDto> = {
    label: question.label
  };
  if (question instanceof MultipleChoiceQuestion) {
    questionDto.options = question.options.map(option => option.toString());
  }
  return questionDto as QuestionDto;
}

