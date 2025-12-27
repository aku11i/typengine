import { input } from "./input.ts";

export type SentenceDisplay = {
  text: string;
  reading?: string;
};

export type SentenceInput = {
  patterns: string[];
};

export type SentenceOptions = {
  display: SentenceDisplay;
  input: SentenceInput;
};

export type InputResult = {
  accepted: boolean;
  completed: boolean;
  remaining: string[];
};

export type SentenceState = {
  remainingPatterns: string[];
  typedValue: string;
};

export class Sentence {
  public readonly display: SentenceDisplay;
  private readonly patterns: string[];
  private state: SentenceState;

  constructor(options: SentenceOptions) {
    this.display = options.display;
    this.patterns = options.input.patterns;
    this.state = {
      remainingPatterns: [...this.patterns],
      typedValue: "",
    };
  }

  input(value: string): InputResult {
    return input(this.state, value);
  }

  get typed(): string {
    return this.state.typedValue;
  }
}
