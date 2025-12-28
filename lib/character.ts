import { input, type InputResult, type InputState } from "./input.ts";
import type { CharacterDefinition } from "./types.ts";

export class Character {
  public readonly definition: CharacterDefinition;
  private state: InputState;

  constructor(definition: CharacterDefinition) {
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

  get remaining(): string[] {
    return [...this.state.remainingPatterns];
  }

  get completed(): boolean {
    return this.state.remainingPatterns.some((pattern) => pattern.length === 0);
  }
}
