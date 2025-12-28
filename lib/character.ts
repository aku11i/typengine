import { input, type InputResult, type InputState } from "./input.ts";
import type { CharacterDefinition } from "./types.ts";

export class Character {
  public readonly definition: CharacterDefinition;
  private state: InputState;
  private timing: { startAt: string | null; completedAt: string | null };

  constructor(definition: CharacterDefinition) {
    this.definition = definition;
    this.state = {
      remainingPatterns: [...definition.patterns],
      typedValue: "",
    };
    this.timing = { startAt: null, completedAt: null };
  }

  input(value: string): InputResult {
    const result = input(this.state, value);
    if (result.completed) {
      this.timing.completedAt = result.inputAt;
    }
    return result;
  }

  start(): string {
    if (this.timing.startAt !== null) {
      throw new Error("Character has already started.");
    }

    this.timing.startAt = new Date().toISOString();
    return this.timing.startAt;
  }

  get typed(): string {
    return this.state.typedValue;
  }

  get remaining(): string[] {
    return [...this.state.remainingPatterns];
  }

  get completed(): boolean {
    return this.state.remainingPatterns.some((pattern) => pattern.length === 0);
  }

  get startAt(): string | null {
    return this.timing.startAt;
  }

  get completedAt(): string | null {
    return this.timing.completedAt;
  }
}
