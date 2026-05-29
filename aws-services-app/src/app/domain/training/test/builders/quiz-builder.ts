import {Question} from "../../models/question";
import {Quiz} from "../../quiz";
import {QuestionBuilder} from "./question-builder";
import {QuizId} from "../../quiz-id";
import {Answer} from "../../models/answer";
import {Option} from "../../models/multiple-choice-question";
import {anAnswer} from "./answer-builder";
import {Shuffle} from "../../shuffle";

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
        quiz.submit(anAnswer());
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
