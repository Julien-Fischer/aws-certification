import {Option} from "../../models/multiple-choice-question";

export function anOption(): OptionBuilder {
  return new OptionBuilder();
}

export class OptionBuilder {

  private prefix: string = 'A';
  private label: string = 'Option Label';
  private value?: Option;
  private explanation?: string;

  withPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }

  withLabel(label: string): this {
    this.label = label;
    return this;
  }

  withValue(value: string): this {
    this.value = Option.from(value);
    return this;
  }

  build(): Option {
    let prefix = this.prefix;
    let label = this.label;
    if (this.value != null) {
      prefix = this.value.prefix;
      label = this.value.label;
    }
    return new Option(prefix, label, this.explanation);
  }

  withExplanation(explanation: string) {
    this.explanation = explanation;
    return this;
  }

  withNoExplanation() {
    this.explanation = undefined;
    return this;
  }
}
