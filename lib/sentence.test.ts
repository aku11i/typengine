import assert from "node:assert/strict";
import test from "node:test";

import { Sentence } from "./sentence.ts";

test("Sentence input returns accepted/completed/remaining", () => {
  const sentence = new Sentence({
    display: {
      text: "寿司",
      reading: "すし",
    },
    input: {
      patterns: ["sushi", "susi"],
    },
  });

  assert.deepEqual(sentence.input("s"), {
    accepted: true,
    completed: false,
    remaining: ["ushi", "usi"],
  });
  assert.equal(sentence.typed, "s");

  assert.deepEqual(sentence.input("u"), {
    accepted: true,
    completed: false,
    remaining: ["shi", "si"],
  });
  assert.equal(sentence.typed, "su");

  assert.deepEqual(sentence.input("i"), {
    accepted: false,
    completed: false,
    remaining: ["shi", "si"],
  });
  assert.equal(sentence.typed, "su");
});

test("Sentence completes when any pattern is fully consumed", () => {
  const sentence = new Sentence({
    display: {
      text: "a",
    },
    input: {
      patterns: ["a"],
    },
  });

  assert.deepEqual(sentence.input("a"), {
    accepted: true,
    completed: true,
    remaining: [""],
  });
  assert.equal(sentence.typed, "a");
});
