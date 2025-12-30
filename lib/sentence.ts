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
    const current = this.currentCharacter;
    if (!current) {
      throw new Error("Cannot start an empty sentence.");
    }
    this.options.onSentenceStarted?.({ startedAt: Date.now() });
    current.start();
  }

  input(value: string): InputResult {
    const current = this.currentCharacter;
    if (!current) {
      return {
        accepted: false,
      };
    }

    const result = current.input(value);
    if (!result.accepted) {
      return result;
    }

    if (current.completed) {
      const completed = this.position >= this.characters.length;
      if (completed) {
        this.options.onSentenceCompleted?.({ completedAt: Date.now() });
      } else {
        this.currentCharacter?.start();
      }
    }

    return result;
  }

  get typed(): string {
    return this.characters.map((character) => character.typed).join("");
  }

  get currentCharacter(): Character | null {
    const current = this.characters[this.position];
    return current ?? null;
  }

  get position(): number {
    for (let index = 0; index < this.characters.length; index += 1) {
      if (!this.characters[index].completed) {
        return index;
      }
    }
    return this.characters.length;
  }

  get previewPattern(): string {
    return this.characters.map((character) => character.previewPattern).join("");
  }

  get text(): string {
    return this.definition.text;
  }

  get reading(): string {
    return this.definition.reading;
  }
}
