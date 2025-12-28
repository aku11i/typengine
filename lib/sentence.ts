import type { InputResult } from "./input.ts";
import { Character } from "./character.ts";
import type { SentenceDefinition } from "./types.ts";

export type SentenceState = {
  position: number;
  typedValue: string;
};

export class Sentence {
  public readonly definition: SentenceDefinition;
  private readonly characters: Character[];
  private state: SentenceState;
  private timing: { startAt: string | null };

  constructor(definition: SentenceDefinition) {
    this.definition = definition;
    this.characters = definition.characters.map((character) => new Character(character));
    this.state = { position: 0, typedValue: "" };
    this.timing = { startAt: null };
  }

  input(value: string): InputResult {
    const current = this.currentCharacter;
    if (!current) {
      return {
        accepted: false,
        completed: true,
        remaining: [],
        inputAt: new Date().toISOString(),
      };
    }

    const result = current.input(value);
    if (!result.accepted) {
      return {
        ...result,
        completed: false,
        inputAt: result.inputAt,
      };
    }

    this.state.typedValue += value;

    if (result.completed) {
      this.state.position += 1;
      const next = this.characters[this.state.position];
      if (!next) {
        return {
          ...result,
          completed: true,
          inputAt: result.inputAt,
        };
      }

      next.start();
      return {
        accepted: true,
        completed: false,
        remaining: next.remaining,
        inputAt: result.inputAt,
      };
    }

    return {
      ...result,
      completed: false,
      inputAt: result.inputAt,
    };
  }

  start(): string {
    if (this.timing.startAt !== null) {
      throw new Error("Sentence has already started.");
    }

    this.timing.startAt = new Date().toISOString();
    const current = this.currentCharacter;
    if (current) {
      current.start();
    }
    return this.timing.startAt;
  }

  get typed(): string {
    return this.state.typedValue;
  }

  get currentCharacter(): Character | null {
    return this.characters[this.state.position] ?? null;
  }

  get startAt(): string | null {
    return this.timing.startAt;
  }

  get display(): { text: string; reading: string } {
    return {
      text: this.definition.text,
      reading: this.definition.reading,
    };
  }
}
