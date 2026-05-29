import {Inject, Injectable} from "@angular/core";
import {StartQuiz, startQuizInjectionToken} from "../../domain/training/ports/inbound/start-quiz";
import {Quiz} from "../../domain/training/quiz";
import {Question} from "../../domain/training/models/question";
import {Answer} from "../../domain/training/models/answer";
import {BooleanQuestion} from "../../domain/training/models/boolean-question";
import {MultipleChoiceQuestion, Option} from "../../domain/training/models/multiple-choice-question";

interface QuizDto {
  booleanQuestions: [],
  multipleChoiceQuestions: []
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
    @Inject(startQuizInjectionToken) private startQuiz: StartQuiz
  ) { }

  start(quizDto: QuizDto) {
    const quiz = this.toQuiz(quizDto);
    this.startQuiz.start(quiz);
  }

  private toQuiz(dto: QuizDto): Quiz {
    return new Quiz([
      ...mapBoolean(dto.booleanQuestions),
      ...mapMultipleChoice(dto.multipleChoiceQuestions)
    ]);
  }

}

function mapBoolean(questions: BooleanQuestionDto[]): Question[] {
  return questions
    .map(question => new BooleanQuestion(
      question.label,
      new Answer<boolean>(question.answer)
    ));
}

function mapMultipleChoice(questions: MultipleChoiceQuestionDto[]): Question[] {
  return questions
    .map(question => new MultipleChoiceQuestion(
      question.label,
      new Answer<Option>(mapOption(question.answer)),
      mapOptions(question.options)
    ));
}

function mapOptions(optionDtos: OptionDto[]): Option[] {
  return optionDtos.map(mapOption);
}

function mapOption(optionDto: OptionDto): Option {
  return Option.from(optionDto.value, optionDto.explanation);
}
