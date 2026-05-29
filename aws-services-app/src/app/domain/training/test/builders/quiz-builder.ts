import {Question} from "../../models/question";
import {Quiz} from "../../quiz";
import {QuestionBuilder} from "./question-builder";

export function aQuiz(): QuizBuilder {
  return new QuizBuilder();
}

export class QuizBuilder {

  private questions: Question[] = [];

  with(...questions: QuestionBuilder[]): this {
    this.questions = questions.map(question => question.build());
    return this;
  }

  build(): Quiz {
    return new Quiz(this.questions);
  }

}
