import type { SentenceState } from "./sentence.ts";

export type InputResult = {
  accepted: boolean;
  completed: boolean;
  remaining: string[];
};

export const input = (state: SentenceState, value: string): InputResult => {
  if (state.remainingPatterns.some((pattern) => pattern.length === 0)) {
    return {
      accepted: false,
      completed: true,
      remaining: [...state.remainingPatterns],
    };
  }

  const nextPatterns = state.remainingPatterns
    .filter((pattern) => pattern.startsWith(value))
    .map((pattern) => pattern.slice(value.length));
  if (nextPatterns.length === 0) {
    return {
      accepted: false,
      completed: false,
      remaining: [...state.remainingPatterns],
    };
  }

  state.remainingPatterns = nextPatterns;
  state.typedValue += value;

  return {
    accepted: true,
    completed: nextPatterns.some((pattern) => pattern.length === 0),
    remaining: [...nextPatterns],
  };
};
