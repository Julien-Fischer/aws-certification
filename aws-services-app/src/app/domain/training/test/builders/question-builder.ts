import {BooleanQuestion} from "../../models/boolean-question";
import {SingleChoiceQuestion} from "../../models/single-choice-question";
import {OptionBuilder} from "./option-builder";
import {ExpectedAnswer} from "../../models/expected-answer";
import {BooleanAnswer} from "../../models/boolean-answer";
import {Choice} from "../../models/choice";
import {Option} from "../../models/option";

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

export abstract class QuestionBuilder {
  abstract build(): any;
}

class BooleanQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private answer: ExpectedAnswer<boolean> = BooleanAnswer.TRUE;
  private explanation?: string;

  labelled(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(bool: boolean): this {
    this.answer = BooleanAnswer.from(bool);
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
    return new BooleanQuestion(this.label, this.answer, this.explanation);
  }

}

class SingleChoiceQuestionBuilder extends QuestionBuilder {

  private label: string = 'question text';
  private answer: ExpectedAnswer<Option> = new Choice(Option.from('A. Correct answer'));
  private options: Option[] = [];

  withLabel(label: string): this {
    this.label = label;
    return this;
  }

  withAnswer(answer: string): this {
    this.answer = new Choice(Option.from(answer));
    return this;
  }

  withOptions(...options: OptionBuilder[]): this {
    this.options = options.map(option => option.build());
    return this;
  }

  build(): SingleChoiceQuestion {
    return new SingleChoiceQuestion(this.label, this.answer, this.options);
  }

}
