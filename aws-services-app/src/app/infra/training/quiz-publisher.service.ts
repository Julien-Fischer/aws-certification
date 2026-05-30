import {Inject, Injectable} from "@angular/core";
import {StartQuiz, startQuizInjectionToken} from "../../domain/training/ports/inbound/start-quiz";
import {Question as DomainQuestion} from "../../domain/training/models/question";
import {BooleanQuestion} from "../../domain/training/models/boolean-question";
import {MultipleChoiceQuestion as DomainMultipleChoiceQuestion, Option as DomainOption} from "../../domain/training/models/multiple-choice-question";
import {ShuffleProvider, shuffleProviderInjectionToken} from "./shuffle-provider";
import {Quiz} from "../../domain/training/quiz";
import {ExpectedAnswer} from "../../domain/training/models/expected-answer";
import {Option} from "../../domain/search/models/question";

export interface QuizDto {
  id: string;
  questions: number;
  firstQuestion: QuestionDto;
}

export interface QuestionDto {
  label: string;
  options?: Option[];
}

export interface QuizRequest {
  booleanQuestions: BooleanQuestionRequest[],
  multipleChoiceQuestions: MultipleChoiceQuestionRequest[],
  shuffle?: boolean
}

interface BooleanQuestionRequest {
  label: string;
  answer: boolean;
  explanation?: string;
}

interface MultipleChoiceQuestionRequest {
  label: string;
  answer: OptionDto;
  options: OptionDto[];
}

interface OptionDto {
  value: string;
  explanation?: string;
}

@Injectable({ providedIn: 'root' })
export class CreateQuiz {

  constructor(
    @Inject(startQuizInjectionToken) private startQuiz: StartQuiz,
    @Inject(shuffleProviderInjectionToken) private shuffleProvider: ShuffleProvider,
  ) { }

  publish(quizDto: QuizRequest): QuizDto {
    const questions = this.toQuestions(quizDto);
    const quiz = this.startQuiz.with(questions, this.shuffleProvider.get(quizDto.shuffle ?? false));
    return response(quiz);
  }

  private toQuestions(dto: QuizRequest): DomainQuestion[] {
    return [
      ...mapBoolean(dto.booleanQuestions),
      ...mapMultipleChoice(dto.multipleChoiceQuestions)
    ];
  }

}

function mapBoolean(questions: BooleanQuestionRequest[]): DomainQuestion[] {
  return questions
    .map(question => new BooleanQuestion(
      question.label,
      new ExpectedAnswer<boolean>(question.answer),
      question.explanation
    ));
}

function mapMultipleChoice(questions: MultipleChoiceQuestionRequest[]): DomainQuestion[] {
  return questions
    .map(question => new DomainMultipleChoiceQuestion(
      question.label,
      new ExpectedAnswer<DomainOption>(mapDomainOption(question.answer)),
      mapDomainOptions(question.options)
    ));
}

function mapDomainOptions(optionDtos: OptionDto[]): DomainOption[] {
  return optionDtos.map(mapDomainOption);
}

function mapDomainOption(optionDto: OptionDto): DomainOption {
  return DomainOption.from(optionDto.value, optionDto.explanation);
}

function response(quiz: Quiz): QuizDto {
  return {
    id: quiz.id.toString(),
    questions: quiz.length,
    firstQuestion: toQuestionDto(quiz.questions()[0])
  };
}

function toQuestionDto(question: DomainQuestion): QuestionDto {
  const questionDto: Partial<QuestionDto> = {
    label: question.label
  };
  if (question instanceof DomainMultipleChoiceQuestion) {
    questionDto.options = question.options.map(option => new Option(option.toString()));
  }
  return questionDto as QuestionDto;
}

