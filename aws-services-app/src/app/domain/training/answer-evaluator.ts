import {SubmitAnswer} from "./ports/inbound/submit-answer";
import {Result} from "./quiz";
import {Inject, Injectable} from "@angular/core";
import {QuizRepository, quizRepositoryInjectionToken} from "./ports/outbound/quiz-repository";
import {QuizId} from "./quiz-id";
import {UserAnswer} from "./models/user-answer";

@Injectable({ providedIn: 'root' })
export class AnswerEvaluator implements SubmitAnswer {

  constructor(
    @Inject(quizRepositoryInjectionToken) private quizRepository: QuizRepository
  ) { }

  submit(id: QuizId, answer: UserAnswer): Result {
    const quiz = this.quizRepository.get(id);
    if (quiz == null) throw new Error(`Quiz with id '${id}' not found`);

    const result = quiz.submit(answer);
    this.quizRepository.save(quiz);
    return result;
  }

}
