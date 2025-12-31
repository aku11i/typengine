import assert from "node:assert/strict";
import test from "node:test";

import { Sentence } from "./sentence.ts";

test("Sentence input returns accepted and advances characters", () => {
  const sentence = new Sentence({
    text: "寿司",
    reading: "すし",
    characters: [
      { reading: "す", patterns: ["su"] },
      { reading: "し", patterns: ["shi", "si"] },
    ],
  });
  const current = sentence.currentCharacter;
  assert.ok(current);
  assert.equal(current.definition.reading, "す");

  assert.deepEqual(sentence.input("s"), { accepted: true });
  assert.equal(sentence.typed, "s");
  assert.deepEqual(sentence.currentCharacter?.remainingPatterns, ["u"]);

  assert.deepEqual(sentence.input("u"), { accepted: true });
  assert.equal(sentence.typed, "su");
  assert.deepEqual(sentence.currentCharacter?.remainingPatterns, ["shi", "si"]);

  assert.deepEqual(sentence.input("s"), { accepted: true });
  assert.equal(sentence.typed, "sus");
  assert.deepEqual(sentence.currentCharacter?.remainingPatterns, ["hi", "i"]);

  assert.deepEqual(sentence.input("i"), { accepted: true });
  assert.equal(sentence.typed, "susi");
  assert.equal(sentence.currentCharacter, null);
});

test("Sentence completes when any pattern is fully consumed", () => {
  const sentence = new Sentence({
    text: "a",
    reading: "a",
    characters: [{ reading: "a", patterns: ["a"] }],
  });

  assert.deepEqual(sentence.input("a"), { accepted: true });
  assert.equal(sentence.typed, "a");
  assert.equal(sentence.currentCharacter, null);
});

test("Sentence callbacks provide timestamps and keys", () => {
  const originalNow = Date.now;
  let now = 0;
  Date.now = () => {
    now += 1;
    return now;
  };

  try {
    const sentenceStarted: { startedAt: number }[] = [];
    const sentenceCompleted: { completedAt: number }[] = [];
    const characterStarted: { startedAt: number }[] = [];
    const characterTyped: { typedAt: number; key: string }[] = [];
    const characterMistyped: { typedAt: number; key: string }[] = [];
    const characterCompleted: { completedAt: number }[] = [];

    const sentence = new Sentence(
      {
        text: "a",
        reading: "a",
        characters: [{ reading: "a", patterns: ["a"] }],
      },
      {
        onSentenceStarted: (payload) => sentenceStarted.push(payload),
        onSentenceCompleted: (payload) => sentenceCompleted.push(payload),
        onCharacterStarted: (payload) => characterStarted.push(payload),
        onCharacterTyped: (payload) => characterTyped.push(payload),
        onCharacterMistyped: (payload) => characterMistyped.push(payload),
        onCharacterCompleted: (payload) => characterCompleted.push(payload),
      },
    );

    sentence.start();
    assert.deepEqual(sentenceStarted, [{ startedAt: 1 }]);
    assert.deepEqual(characterStarted, [{ startedAt: 2 }]);

    assert.deepEqual(sentence.input("x"), { accepted: false });
    assert.deepEqual(characterMistyped, [{ typedAt: 3, key: "x" }]);

    assert.deepEqual(sentence.input("a"), { accepted: true });
    assert.deepEqual(characterTyped, [{ typedAt: 4, key: "a" }]);
    assert.deepEqual(characterCompleted, [{ completedAt: 4 }]);
    assert.deepEqual(sentenceCompleted, [{ completedAt: 5 }]);
  } finally {
    Date.now = originalNow;
  }
});

test("Sentence previewPattern returns character previews", () => {
  const sentence = new Sentence({
    text: "し",
    reading: "し",
    characters: [{ reading: "し", patterns: ["shi", "si"] }],
  });

  assert.equal(sentence.previewPattern, "shi");

  sentence.input("s");
  assert.equal(sentence.previewPattern, "shi");
});
