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

  const step1 = sentence.input("s");
  assert.deepEqual(
    { accepted: step1.accepted, completed: step1.completed, remaining: step1.remaining },
    {
      accepted: true,
      completed: false,
      remaining: ["u"],
    },
  );
  assert.ok(step1.inputAt);
  assert.equal(sentence.typed, "s");

  const step2 = sentence.input("u");
  assert.deepEqual(
    { accepted: step2.accepted, completed: step2.completed, remaining: step2.remaining },
    {
      accepted: true,
      completed: false,
      remaining: ["shi", "si"],
    },
  );
  assert.ok(step2.inputAt);
  assert.equal(sentence.typed, "su");

  const step3 = sentence.input("s");
  assert.deepEqual(
    { accepted: step3.accepted, completed: step3.completed, remaining: step3.remaining },
    {
      accepted: true,
      completed: false,
      remaining: ["hi", "i"],
    },
  );
  assert.ok(step3.inputAt);
  assert.equal(sentence.typed, "sus");

  const step4 = sentence.input("i");
  assert.deepEqual(
    { accepted: step4.accepted, completed: step4.completed, remaining: step4.remaining },
    {
      accepted: true,
      completed: true,
      remaining: [""],
    },
  );
  assert.ok(step4.inputAt);
  assert.equal(sentence.typed, "susi");
});

test("Sentence completes when any pattern is fully consumed", () => {
  const sentence = new Sentence({
    text: "a",
    reading: "a",
    characters: [{ reading: "a", patterns: ["a"] }],
  });

  const result = sentence.input("a");
  assert.deepEqual(
    { accepted: result.accepted, completed: result.completed, remaining: result.remaining },
    {
      accepted: true,
      completed: true,
      remaining: [""],
    },
  );
  assert.ok(result.inputAt);
  assert.equal(sentence.typed, "a");
});

test("Sentence start records start time and starts first character", () => {
  const sentence = new Sentence({
    text: "寿司",
    reading: "すし",
    characters: [
      { reading: "す", patterns: ["su"] },
      { reading: "し", patterns: ["shi", "si"] },
    ],
  });

  const startedAt = sentence.start();
  assert.ok(startedAt);
  assert.equal(sentence.startAt, startedAt);
  assert.ok(sentence.currentCharacter?.startAt);
  assert.throws(() => sentence.start(), /already started/);
});
