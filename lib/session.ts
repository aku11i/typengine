import { Sentence } from "./sentence.ts";

export type SessionOptions = {
  onSessionStarted?: (payload: { startedAt: number }) => void;
  onSessionCompleted?: (payload: { completedAt: number }) => void;
};

export type SessionInputResult = {
  accepted: boolean;
};

export class Session {
  public readonly sentences: Sentence[];
  private readonly options: SessionOptions;

  constructor(sentences: Sentence[], options: SessionOptions = {}) {
    if (sentences.length === 0) {
      throw new Error("Session requires at least one sentence.");
    }

    this.sentences = sentences;
    this.options = options;
  }

  start(): void {
    const current = this.currentSentence;
    if (!current) {
      throw new Error("Cannot start a completed session.");
    }
    this.options.onSessionStarted?.({ startedAt: Date.now() });
    current.start();
  }

  input(value: string): SessionInputResult {
    const current = this.currentSentence;
    if (!current) {
      throw new Error("Cannot input to a completed session.");
    }
    const result = current.input(value);

    if (!result.accepted) {
      return result;
    }

    if (!current.completed) {
      return result;
    }

    const next = this.currentSentence;

    if (next) {
      next.start();
      return result;
    }

    this.options.onSessionCompleted?.({ completedAt: Date.now() });

    return result;
  }

  get currentSentence(): Sentence | null {
    const current = this.sentences[this.position];
    return current ?? null;
  }

  get position(): number {
    for (let index = 0; index < this.sentences.length; index += 1) {
      if (!this.sentences[index].completed) {
        return index;
      }
    }
    return -1;
  }

  get completed(): boolean {
    return this.position < 0;
  }
}
