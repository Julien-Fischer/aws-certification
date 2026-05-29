import {Question} from "../../models/question";
import {Quiz} from "../../quiz";
import {QuestionBuilder} from "./question-builder";
import {QuizId} from "../../quiz-id";

export function aQuiz(): QuizBuilder {
  return new QuizBuilder();
}

export class QuizBuilder {

  private questions: Question[] = [];
  private id?: QuizId;

  identified(id: string): this {
    this.id = new QuizId(id);
    return this;
  }

  with(...questions: QuestionBuilder[]): this {
    this.questions = questions.map(question => question.build());
    return this;
  }

  build(): Quiz {
    return new Quiz(this.questions, this.id);
  }

}
