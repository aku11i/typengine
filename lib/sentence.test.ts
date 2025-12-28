import assert from "node:assert/strict";
import test from "node:test";

import { Sentence } from "./sentence.ts";

test("Sentence input returns accepted/completed/remaining", () => {
  const sentence = new Sentence({
    text: "寿司",
    reading: "すし",
    characters: [
      { reading: "す", patterns: ["su"] },
      { reading: "し", patterns: ["shi", "si"] },
    ],
  });
  assert.equal(sentence.currentCharacter?.definition.reading, "す");

  assert.deepEqual(sentence.input("s"), {
    accepted: true,
    completed: false,
    remaining: ["u"],
  });
  assert.equal(sentence.typed, "s");

  assert.deepEqual(sentence.input("u"), {
    accepted: true,
    completed: false,
    remaining: ["shi", "si"],
  });
  assert.equal(sentence.typed, "su");

  assert.deepEqual(sentence.input("s"), {
    accepted: true,
    completed: false,
    remaining: ["hi", "i"],
  });
  assert.equal(sentence.typed, "sus");

  assert.deepEqual(sentence.input("i"), {
    accepted: true,
    completed: true,
    remaining: [""],
  });
  assert.equal(sentence.typed, "susi");
});

test("Sentence completes when any pattern is fully consumed", () => {
  const sentence = new Sentence({
    text: "a",
    characters: [{ reading: "a", patterns: ["a"] }],
  });

  assert.deepEqual(sentence.input("a"), {
    accepted: true,
    completed: true,
    remaining: [""],
  });
  assert.equal(sentence.typed, "a");
});
