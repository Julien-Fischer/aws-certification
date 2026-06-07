import {BooleanQuestion} from "../../models/questions/boolean-question";
import {SingleChoiceQuestion} from "../../models/questions/single-choice-question";
import {OptionBuilder} from "./option-builder";
import {Option} from "../../models/option";
import {ExpectedBoolean} from "../../models/answers/expected-boolean";
import {ExpectedChoice} from "../../models/answers/expected-choice";
import {ExpectedCombination} from "../../models/answers/expected-combination";
import { MultipleChoiceQuestion } from "../../models/questions/multiple-choice-question";

export function aQuestion(): BooleanQuestionBuilder {
  return aBooleanQuestion();
}

export function aBooleanQuestion(): BooleanQuestionBuilder {
  return new BooleanQuestionBuilder();
}

export function aTrueStatement(): BooleanQuestionBuilder {
  return aBooleanQuestion().withAnswer(true);
}

export function aFalseStatement(): BooleanQuestionBuilder {
  return aBooleanQuestion().withAnswer(false);
}

export function aSingleChoiceQuestion(): SingleChoiceQuestionBuilder {
  return new SingleChoiceQuestionBuilder();
}

export function aMultipleChoiceQuestion(): MultipleChoiceQuestionBuilder {
  return new MultipleChoiceQuestionBuilder();
}

export abstract class QuestionBuilder {
  abstract build(): any;
}

class BooleanQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private answer: boolean = true;
  private explanation?: string;

  labelled(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(bool: boolean): this {
    this.answer = bool;
    return this;
  }

  withExplanation(explanation: string): this {
    this.explanation = explanation;
    return this;
  }

  withNoExplanation(): this {
    this.explanation = undefined;
    return this;
  }

  build(): BooleanQuestion {
    return new BooleanQuestion(this.label, ExpectedBoolean.of(this.answer, this.explanation));
  }

}

class SingleChoiceQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private expectedAnswer: string = 'A. Correct answer';
  private explanation?: string;
  private options: Option[] = [Option.from('A. Option 1')];

  labelled(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(answer: string): this {
    this.expectedAnswer = answer;
    return this;
  }

  withOptions(...options: OptionBuilder[]): this {
    this.options = options.map(option => option.build());
    return this;
  }

  withExplanation(explanation: string): this {
    this.explanation = explanation;
    return this;
  }

  withNoExplanation(): this {
    this.explanation = undefined;
    return this;
  }

  build(): SingleChoiceQuestion {
    return new SingleChoiceQuestion(
      this.label,
      new ExpectedChoice(Option.from(this.expectedAnswer), this.explanation),
      this.options
    );
  }

}

class MultipleChoiceQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private expectedAnswer: string[] = ['A. Correct answer'];
  private explanation?: string;
  private options: Option[] = [Option.from('A. Option 1')];

  labelled(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(answer: string[]): this {
    this.expectedAnswer = answer;
    return this;
  }

  withOptions(...options: OptionBuilder[]): this {
    this.options = options.map(option => option.build());
    return this;
  }

  withExplanation(explanation: string): this {
    this.explanation = explanation;
    return this;
  }

  withNoExplanation(): this {
    this.explanation = undefined;
    return this;
  }

  build(): MultipleChoiceQuestion {
    const options: Option[] = this.expectedAnswer.map(subject => Option.from(subject));

    return new MultipleChoiceQuestion(
      this.label,
      new ExpectedCombination(options, this.explanation),
      this.options
    );
  }

}
