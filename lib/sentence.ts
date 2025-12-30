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

export class Sentence {
  public readonly definition: SentenceDefinition;
  private readonly characters: Character[];
  private readonly options: SentenceOptions;

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
  }

  start(): void {
    this.options.onSentenceStarted?.({ startedAt: Date.now() });
    const current = this.currentCharacter;
    if (!current) {
      return;
    }
    current.start();
  }

  input(value: string): InputResult {
    const currentPosition = this.position;
    const current = this.characters[currentPosition] ?? null;
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

    if (result.completed) {
      const nextPosition = this.findNextIncompletePosition(currentPosition + 1);
      const next = nextPosition === null ? null : this.characters[nextPosition];
      if (!next) {
        this.options.onSentenceCompleted?.({ completedAt: Date.now() });
        return {
          ...result,
          completed: true,
        };
      }

      next.start();
      return {
        ...result,
        completed: false,
      };
    }

    return {
      ...result,
      completed: false,
    };
  }

  get typed(): string {
    return this.characters.map((character) => character.typed).join("");
  }

  get currentCharacter(): Character | null {
    const current = this.characters[this.position];
    return current ?? null;
  }

  get position(): number {
    const nextPosition = this.findNextIncompletePosition(0);
    return nextPosition ?? this.characters.length;
  }

  get previewPatterns(): string[] {
    return this.characters.map((character) => character.previewPattern);
  }

  get display(): { text: string; reading: string } {
    return {
      text: this.definition.text,
      reading: this.definition.reading,
    };
  }

  private findNextIncompletePosition(start: number): number | null {
    for (let index = start; index < this.characters.length; index += 1) {
      if (!this.characters[index].completed) {
        return index;
      }
    }
    return null;
  }
}
