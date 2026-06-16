import {
  BooleanQuestion,
  MultipleChoiceQuestion, Option,
  Question,
  SingleChoiceQuestion
} from "../../domain/search/models/question";
import {QuizRequest} from "../../infra/training/create-quiz.service";

export class QuestionsToQuizRequest {

  public toQuizRequest(questions: Question[], shuffle: boolean): QuizRequest {
    return this.toRequest(
      this.getBooleanQuestions(questions),
      this.getSingleChoiceQuestions(questions),
      this.getMultipleChoiceQuestions(questions),
      shuffle
    );
  }

  private getBooleanQuestions(questions: Question[]): BooleanQuestion[] {
    return questions.filter(question => !this.hasOptions(question));
  }

  private getSingleChoiceQuestions(questions: Question[]): SingleChoiceQuestion[] {
    return questions.filter(question => isSingleChoice(question)) as SingleChoiceQuestion[];
  }

  private getMultipleChoiceQuestions(questions: Question[]): MultipleChoiceQuestion[] {
    return questions.filter(question => isMultipleChoice(question)) as MultipleChoiceQuestion[];
  }

  private hasOptions(question: Question): boolean {
    return 'options' in question;
  }

  private toRequest(
    booleanQuestions: BooleanQuestion[],
    singleChoiceQuestions: SingleChoiceQuestion[],
    multipleChoiceQuestions: MultipleChoiceQuestion[],
    shuffle: boolean,
  ): QuizRequest {
    return {
      booleanQuestions: booleanQuestions.map(question => ({
        label: question.label,
        answer: question.answer.value,
        explanation: question.answer.explanation
      })),
      singleChoiceQuestions: singleChoiceQuestions.map(question => ({
        label: question.label,
        answer: {
          value: question.answer.value.prefix,
          explanation: question.answer.explanation
        },
        options: question.options.map((option: Option) => option.toString())
      })),
      multipleChoiceQuestions: multipleChoiceQuestions.map(question => ({
        label: question.label,
        answer: question.answer.value.map(option => option.prefix),
        explanation: question.answer.explanation,
        options: question.options.map((option: Option) => option.toString())
      })),
      shuffle
    };
  }

}


function isSingleChoice(question: Question): question is SingleChoiceQuestion {
  return question && 'options' in question && !Array.isArray(question.answer.value);
}

function isMultipleChoice(question: Question): question is MultipleChoiceQuestion {
  return question && 'options' in question && Array.isArray(question.answer.value);
}
