import {Answer} from "../../models/answer";
import {BooleanQuestion} from "../../models/boolean-question";
import {MultipleChoiceQuestion, Option} from "../../models/multiple-choice-question";
import {OptionBuilder} from "./option-builder";

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

export function aMultipleChoiceQuestion(): MultipleChoiceQuestionBuilder {
  return new MultipleChoiceQuestionBuilder();
}

export abstract class QuestionBuilder {
  abstract build(): any;
}

class BooleanQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private answer: Answer<boolean> = new Answer(true);

  withLabel(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(bool: boolean): this {
    this.answer = new Answer(bool);
    return this;
  }

  build(): BooleanQuestion {
    return new BooleanQuestion(this.label, this.answer);
  }

}

class MultipleChoiceQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private answer: Answer<Option> = new Answer(Option.from('A. Correct answer'));
  private options: Option[] = [];

  withLabel(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(answer: string): this {
    this.answer = new Answer(Option.from(answer));
    return this;
  }

  withOptions(...options: OptionBuilder[]): this {
    this.options = options.map(option => option.build(this.label));
    return this;
  }

  build(): MultipleChoiceQuestion {
    return new MultipleChoiceQuestion(this.label, this.answer, this.options);
  }

}
