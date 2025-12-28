import type { InputResult } from "./input.ts";
import { Character } from "./character.ts";
import type { SentenceDefinition } from "./types.ts";

export type SentenceOptions = {
  onSentenceStarted?: (payload: { startedAt: number }) => void;
  onSentenceCompleted?: (payload: { completedAt: number }) => void;
  onCharacterStarted?: (payload: { startedAt: number }) => void;
  onCharacterTyped?: (payload: { typedAt: number; key: string }) => void;
  onCharacterMistyped?: (payload: { typedAt: number; key: string }) => void;
  onCharacterCompleted?: (payload: { completedAt: number }) => void;
};

export type SentenceState = {
  position: number;
  typedValue: string;
};

export class Sentence {
  public readonly definition: SentenceDefinition;
  private readonly characters: Character[];
  private readonly options: SentenceOptions;
  private state: SentenceState;

  constructor(definition: SentenceDefinition, options: SentenceOptions = {}) {
    this.definition = definition;
    this.options = options;
    const characterOptions = {
      onCharacterStarted: options.onCharacterStarted,
      onCharacterTyped: options.onCharacterTyped,
      onCharacterMistyped: options.onCharacterMistyped,
      onCharacterCompleted: options.onCharacterCompleted,
    };
    this.characters = definition.characters.map(
      (character) => new Character(character, characterOptions),
    );
    this.state = { position: 0, typedValue: "" };
  }

  start(): void {
    this.options.onSentenceStarted?.({ startedAt: Date.now() });
    this.currentCharacter?.start();
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
        this.options.onSentenceCompleted?.({ completedAt: Date.now() });
        return {
          ...result,
          completed: true,
        };
      }

      next.start();
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
