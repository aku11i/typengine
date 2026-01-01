import assert from "node:assert/strict";
import test from "node:test";

import { createEnglishSentenceDefinition } from "./createEnglishSentenceDefinition.ts";

test("createEnglishSentenceDefinition builds patterns from reading", () => {
  const definition = createEnglishSentenceDefinition("Hello, world!");

  assert.deepEqual(definition, {
    text: "Hello, world!",
    reading: "Hello, world!",
    characters: [
      { reading: "H", patterns: ["H"] },
      { reading: "e", patterns: ["e"] },
      { reading: "l", patterns: ["l"] },
      { reading: "l", patterns: ["l"] },
      { reading: "o", patterns: ["o"] },
      { reading: ",", patterns: [","] },
      { reading: " ", patterns: [" "] },
      { reading: "w", patterns: ["w"] },
      { reading: "o", patterns: ["o"] },
      { reading: "r", patterns: ["r"] },
      { reading: "l", patterns: ["l"] },
      { reading: "d", patterns: ["d"] },
      { reading: "!", patterns: ["!"] },
    ],
  });
});

test("createEnglishSentenceDefinition uses the provided reading", () => {
  const definition = createEnglishSentenceDefinition("Hello", "hello");

  assert.equal(definition.text, "Hello");
  assert.equal(definition.reading, "hello");
  assert.deepEqual(definition.characters, [
    { reading: "h", patterns: ["h"] },
    { reading: "e", patterns: ["e"] },
    { reading: "l", patterns: ["l"] },
    { reading: "l", patterns: ["l"] },
    { reading: "o", patterns: ["o"] },
  ]);
});

test("createEnglishSentenceDefinition allows digits, spaces, and symbols", () => {
  const reading = "OK? It's 2025-01-01.";
  const definition = createEnglishSentenceDefinition(reading);

  assert.equal(definition.reading, reading);
  assert.equal(definition.characters.length, reading.length);
  assert.deepEqual(definition.characters[2], { reading: "?", patterns: ["?"] });
  assert.deepEqual(definition.characters[6], { reading: "'", patterns: ["'"] });
  assert.deepEqual(definition.characters[9], { reading: "2", patterns: ["2"] });
  assert.deepEqual(definition.characters[13], { reading: "-", patterns: ["-"] });
  assert.deepEqual(definition.characters.at(-1), { reading: ".", patterns: ["."] });
});

test("createEnglishSentenceDefinition throws on unsupported characters", () => {
  assert.throws(() => createEnglishSentenceDefinition("Hello_"), /Unsupported English character/);
});
