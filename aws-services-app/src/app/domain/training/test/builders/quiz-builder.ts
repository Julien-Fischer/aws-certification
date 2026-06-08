import {Question} from "../../models/questions/question";
import {Quiz} from "../../quiz";
import {QuizId} from "../../quiz-id";
import {aUserAnswer} from "./answer-builder";
import {buildAll, Builder} from "../../../../test/builder";

export function aQuiz(): QuizBuilder {
  return new QuizBuilder();
}

export function aCompletedQuiz() {
  return {
    with(...questions: Builder<any>[]) {
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

export class QuizBuilder implements Builder<Quiz> {

  private questions: Question[] = [];
  private id?: QuizId;

  identified(id: string | QuizId): this {
    this.id = id instanceof QuizId ? id : new QuizId(id);
    return this;
  }

  with(...questions: Builder<any>[]): this {
    this.questions = buildAll(questions);
    return this;
  }

  build(): Quiz {
    return new Quiz(this.questions, this.id);
  }

}
