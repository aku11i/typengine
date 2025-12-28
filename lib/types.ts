export type CharacterDefinition = {
  reading: string;
  patterns: string[];
};

export type SentenceDefinition = {
  text: string;
  reading?: string;
  characters: CharacterDefinition[];
};
