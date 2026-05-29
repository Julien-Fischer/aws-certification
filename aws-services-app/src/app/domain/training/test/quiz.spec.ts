import { describe, it, expect } from 'vitest';
import {aQuiz} from "./builders/quiz-builder";
import {aQuestion} from "./builders/question-builder";
import {Quiz} from "../quiz";

describe('Quiz', () => {

  it('must have questions', () => {
    expect(() => new Quiz([]))
      .toThrow('No questions provided');
  })

  it('has a length', () => {
    const quiz = aQuiz()
      .withQuestions(aQuestion(), aQuestion())
      .build();

    expect(quiz.length()).toBe(2);
  })

})



