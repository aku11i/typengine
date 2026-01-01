import type { SentenceDefinition } from "./types.ts";

const ALLOWED_CHARACTER = /^[A-Za-z0-9 ,.!?'-]$/;

const isAllowedCharacter = (char: string): boolean => ALLOWED_CHARACTER.test(char);

export const createEnglishSentenceDefinition = (
  text: string,
  reading: string = text,
): SentenceDefinition => {
  const characters: SentenceDefinition["characters"] = [];

  for (const char of reading) {
    if (!isAllowedCharacter(char)) {
      throw new Error(`Unsupported English character: ${char}`);
    }

    characters.push({
      reading: char,
      patterns: [char],
    });
  }

  return {
    text,
    reading,
    characters,
  };
};
