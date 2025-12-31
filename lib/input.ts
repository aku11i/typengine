export type InputState = {
  remainingPatterns: string[];
  typedValue: string;
};

export type InputResult = {
  accepted: boolean;
};

export const input = (state: InputState, value: string): InputResult => {
  if (state.remainingPatterns.some((pattern) => pattern.length === 0)) {
    return {
      accepted: false,
    };
  }

  const nextPatterns = state.remainingPatterns
    .filter((pattern) => pattern.startsWith(value))
    .map((pattern) => pattern.slice(value.length));
  if (nextPatterns.length === 0) {
    return {
      accepted: false,
    };
  }

  state.remainingPatterns = nextPatterns;
  state.typedValue += value;

  return {
    accepted: true,
  };
};
