import { input } from "./input.ts";
import type { InputResult } from "./input.ts";
import type { SentenceDefinition } from "./types.ts";

export type SentenceState = {
  remainingPatterns: string[];
  typedValue: string;
};

export class Sentence {
  public readonly definition: SentenceDefinition;
  private state: SentenceState;

  constructor(definition: SentenceDefinition) {
    this.definition = definition;
    this.state = {
      remainingPatterns: [...definition.patterns],
      typedValue: "",
    };
  }

  input(value: string): InputResult {
    return input(this.state, value);
  }

  get typed(): string {
    return this.state.typedValue;
  }

  get display(): { text: string; reading?: string } {
    return {
      text: this.definition.text,
      reading: this.definition.reading,
    };
  }
}
