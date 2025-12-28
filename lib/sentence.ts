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

  constructor(definition: SentenceDefinition) {
    this.definition = definition;
    this.characters = definition.characters.map((character) => new Character(character));
    this.state = { position: 0, typedValue: "" };
  }

  input(value: string): InputResult {
    const current = this.currentCharacter;
    if (!current) {
      return {
        accepted: false,
        completed: true,
        remaining: [],
      };
    }

    const result = current.input(value);
    if (!result.accepted) {
      return {
        ...result,
        completed: false,
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
        };
      }

      return {
        accepted: true,
        completed: false,
        remaining: next.remaining,
      };
    }

    return {
      ...result,
      completed: false,
    };
  }

  get typed(): string {
    return this.state.typedValue;
  }

  get currentCharacter(): Character | null {
    return this.characters[this.state.position] ?? null;
  }

  get display(): { text: string; reading: string } {
    return {
      text: this.definition.text,
      reading: this.definition.reading,
    };
  }
}
