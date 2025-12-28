export type InputState = {
  remainingPatterns: string[];
  typedValue: string;
};

export type InputResult = {
  accepted: boolean;
  completed: boolean;
  remaining: string[];
  inputAt: string;
};

export const input = (state: InputState, value: string): InputResult => {
  const inputAt = new Date().toISOString();
  if (state.remainingPatterns.some((pattern) => pattern.length === 0)) {
    return {
      accepted: false,
      completed: true,
      remaining: [...state.remainingPatterns],
      inputAt,
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
      inputAt,
    };
  }

  state.remainingPatterns = nextPatterns;
  state.typedValue += value;
  const completed = nextPatterns.some((pattern) => pattern.length === 0);
  return {
    accepted: true,
    completed,
    remaining: [...nextPatterns],
    inputAt,
  };
};
