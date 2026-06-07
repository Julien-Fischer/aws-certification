import {Inject, Injectable} from "@angular/core";
import {StartQuiz, startQuizInjectionToken} from "../../domain/training/ports/inbound/start-quiz";
import {Question} from "../../domain/training/models/questions/question";
import {BooleanQuestion} from "../../domain/training/models/questions/boolean-question";
import {SingleChoiceQuestion as DomainMultipleChoiceQuestion} from "../../domain/training/models/questions/single-choice-question";
import {ShuffleProvider, shuffleProviderInjectionToken} from "./shuffle-provider";
import {Quiz} from "../../domain/training/quiz";
import {Option as OptionDto} from "../../domain/search/models/question";
import {Option} from "../../domain/training/models/option";
import {ExpectedBoolean} from "../../domain/training/models/answers/expected-boolean";
import {ExpectedChoice} from "../../domain/training/models/answers/expected-choice";

export interface QuizDto {
  id: string;
  questions: number;
  firstQuestion: QuestionDto;
}

export interface QuestionDto {
  label: string;
  options?: OptionDto[];
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
  answer: ExpectedAnswerRequest;
  options: string[];
}

interface ExpectedAnswerRequest {
  value: string;
  explanation?: string;
}


@Injectable({ providedIn: 'root' })
export class CreateQuiz {

  private quizMapper = new DtoToQuestion();
  private responseMapper = new QuizToResponse();

  constructor(
    @Inject(startQuizInjectionToken) private startQuiz: StartQuiz,
    @Inject(shuffleProviderInjectionToken) private shuffleProvider: ShuffleProvider,
  ) { }

  publish(quizDto: QuizRequest): QuizDto {
    const questions = this.quizMapper.toQuestions(quizDto);
    const quiz = this.startQuiz.with(questions, this.shuffleProvider.get(quizDto.shuffle ?? false));
    return this.responseMapper.toResponse(quiz);
  }

}

class DtoToQuestion {

  toQuestions(dto: QuizRequest): Question[] {
    return [
      ...this.mapBoolean(dto.booleanQuestions),
      ...this.mapMultipleChoice(dto.multipleChoiceQuestions)
    ];
  }

  private mapBoolean(questions: BooleanQuestionRequest[]): Question[] {
    return questions
      .map(question => new BooleanQuestion(
        question.label,
        ExpectedBoolean.of(question.answer, question.explanation),
      ));
  }

  private mapMultipleChoice(questions: MultipleChoiceQuestionRequest[]): Question[] {
    return questions
      .map(question => new DomainMultipleChoiceQuestion(
        question.label,
        this.toExpectedChoice(question.answer),
        this.toOptions(question.options)
      ));
  }

  private toExpectedChoice(answer: ExpectedAnswerRequest): ExpectedChoice {
    return new ExpectedChoice(this.toOption(answer.value), answer.explanation);
  }

  private toOptions(options: string[]): Option[] {
    return options.map(this.toOption);
  }

  private toOption(option: string): Option {
    return Option.from(option);
  }

}

class QuizToResponse {

  toResponse(quiz: Quiz): QuizDto {
    return {
      id: quiz.id.toString(),
      questions: quiz.length,
      firstQuestion: this.toQuestionDto(quiz.questions()[0])
    };
  }

  private toQuestionDto(question: Question): QuestionDto {
    const questionDto: Partial<QuestionDto> = {
      label: question.label
    };
    if (question instanceof DomainMultipleChoiceQuestion) {
      questionDto.options = question.options.map(option => new OptionDto(option.toString()));
    }
    return questionDto as QuestionDto;
  }

}

