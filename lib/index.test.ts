import assert from "node:assert/strict";
import test from "node:test";

import {
  Character,
  Sentence,
  Session,
  createEnglishSentenceDefinition,
  createJapaneseSentenceDefinition,
} from "./index.ts";
import { Character as DirectCharacter } from "./character.ts";
import { Sentence as DirectSentence } from "./sentence.ts";
import { Session as DirectSession } from "./session.ts";
import { createEnglishSentenceDefinition as DirectCreateEnglishSentenceDefinition } from "./createEnglishSentenceDefinition.ts";
import { createJapaneseSentenceDefinition as DirectCreateJapaneseSentenceDefinition } from "./createJapaneseSentenceDefinition.ts";

test("index re-exports runtime modules", () => {
  assert.equal(Character, DirectCharacter);
  assert.equal(Sentence, DirectSentence);
  assert.equal(Session, DirectSession);
  assert.equal(createEnglishSentenceDefinition, DirectCreateEnglishSentenceDefinition);
  assert.equal(createJapaneseSentenceDefinition, DirectCreateJapaneseSentenceDefinition);
});

test("index exports can be used to run a session", () => {
  const sentence = new Sentence({
    text: "a",
    reading: "a",
    characters: [{ reading: "a", patterns: ["a"] }],
  });
  const session = new Session([sentence]);

  session.start();
  assert.deepEqual(session.input("a"), { accepted: true });
  assert.equal(session.completed, true);
});
