import {Option} from "../../models/multiple-choice-question";

export function anOption(): OptionBuilder {
  return new OptionBuilder();
}

export class OptionBuilder {

  private prefix: string = 'A';
  private label: string = 'Option Label';
  private value?: Option;

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

  build(label: string): Option {
    return this.value == null
      ? new Option(this.prefix, label)
      : this.value;
  }

}
