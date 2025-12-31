import { input, type InputResult, type InputState } from "./input.ts";
import type { CharacterDefinition } from "./types.ts";

export type CharacterOptions = {
  onCharacterStarted?: (payload: { startedAt: number }) => void;
  onCharacterTyped?: (payload: { typedAt: number; key: string }) => void;
  onCharacterMistyped?: (payload: { typedAt: number; key: string }) => void;
  onCharacterCompleted?: (payload: { completedAt: number }) => void;
};

export class Character {
  public readonly definition: CharacterDefinition;
  private readonly options: CharacterOptions;
  private state: InputState;

  constructor(definition: CharacterDefinition, options: CharacterOptions = {}) {
    this.definition = definition;
    this.options = options;
    this.state = {
      remainingPatterns: [...definition.patterns],
      typedValue: "",
    };
  }

  start(): void {
    this.options.onCharacterStarted?.({ startedAt: Date.now() });
  }

  input(value: string): InputResult {
    const result = input(this.state, value);
    const typedAt = Date.now();

    if (!result.accepted) {
      this.options.onCharacterMistyped?.({ typedAt, key: value });
      return result;
    }

    this.options.onCharacterTyped?.({ typedAt, key: value });
    if (this.completed) {
      this.options.onCharacterCompleted?.({ completedAt: typedAt });
    }

    return result;
  }

  get typed(): string {
    return this.state.typedValue;
  }

  get remainingPatterns(): string[] {
    return [...this.state.remainingPatterns];
  }

  get previewPattern(): string {
    const [pattern] = this.state.remainingPatterns;
    return `${this.state.typedValue}${pattern ?? ""}`;
  }

  get completed(): boolean {
    return this.state.remainingPatterns.some((pattern) => pattern.length === 0);
  }
}
