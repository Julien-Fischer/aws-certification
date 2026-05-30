import {Question} from "../../models/question";
import {Quiz} from "../../quiz";
import {QuestionBuilder} from "./question-builder";
import {QuizId} from "../../quiz-id";
import {aUserAnswer} from "./answer-builder";

export function aQuiz(): QuizBuilder {
  return new QuizBuilder();
}

export function aCompletedQuiz() {
  return {
    with(...questions: QuestionBuilder[]) {
      const quiz = aQuiz()
        .with(...questions)
        .build();

      for (let i = 0; i < questions.length; i++) {
        quiz.submit(aUserAnswer());
      }

      return quiz;
    }
  }
}

export class QuizBuilder {

  private questions: Question[] = [];
  private id?: QuizId;

  identified(id: string | QuizId): this {
    this.id = id instanceof QuizId ? id : new QuizId(id);
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
