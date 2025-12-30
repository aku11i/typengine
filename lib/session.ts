import { Sentence } from "./sentence.ts";

export type SessionOptions = {
  onSessionStarted?: (payload: { startedAt: number }) => void;
  onSessionCompleted?: (payload: { completedAt: number }) => void;
};

export type SessionInputResult = {
  accepted: boolean;
  completed: boolean;
  remaining: string[];
  sentenceCompleted: boolean;
};

export type SessionState = {
  position: number;
};

export class Session {
  public readonly sentences: Sentence[];
  private readonly options: SessionOptions;
  private state: SessionState;

  constructor(sentences: Sentence[], options: SessionOptions = {}) {
    if (sentences.length === 0) {
      throw new Error("Session requires at least one sentence.");
    }

    this.sentences = sentences;
    this.options = options;
    this.state = { position: 0 };
  }

  start(): void {
    this.options.onSessionStarted?.({ startedAt: Date.now() });
    this.currentSentence.start();
  }

  input(value: string): SessionInputResult {
    const current = this.currentSentence;
    const result = current.input(value);

    if (!result.accepted) {
      return {
        accepted: false,
        completed: false,
        sentenceCompleted: false,
        remaining: result.remaining,
      };
    }

    if (!result.completed) {
      return {
        accepted: true,
        completed: false,
        sentenceCompleted: false,
        remaining: result.remaining,
      };
    }

    const nextPosition = this.state.position + 1;
    const next = this.sentences[nextPosition];
    this.state.position = nextPosition;

    if (!next) {
      this.options.onSessionCompleted?.({ completedAt: Date.now() });
      return {
        accepted: true,
        completed: true,
        sentenceCompleted: true,
        remaining: result.remaining,
      };
    }

    next.start();

    return {
      accepted: true,
      completed: false,
      sentenceCompleted: true,
      remaining: result.remaining,
    };
  }

  get currentSentence(): Sentence {
    const current = this.sentences[this.state.position];
    if (!current) {
      throw new Error("Current sentence is missing.");
    }
    return current;
  }

  get position(): number {
    return this.state.position;
  }

  get completed(): boolean {
    return this.state.position >= this.sentences.length;
  }
}
