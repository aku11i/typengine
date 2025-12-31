import assert from "node:assert/strict";
import test from "node:test";

import { Sentence } from "./sentence.ts";
import type { CharacterDefinition, SentenceDefinition } from "./types.ts";

test("types describe sentence definitions used by Sentence", () => {
  const character: CharacterDefinition = {
    reading: "a",
    patterns: ["a", "aa"],
  };

  const definition: SentenceDefinition = {
    text: "a",
    reading: "a",
    characters: [character],
  };

  const sentence = new Sentence(definition);
  assert.equal(sentence.text, "a");
  assert.equal(sentence.reading, "a");
});
