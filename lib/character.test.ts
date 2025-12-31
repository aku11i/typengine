import assert from "node:assert/strict";
import test from "node:test";

import { Character } from "./character.ts";

test("Character advances patterns and updates preview", () => {
  const character = new Character({ reading: "shi", patterns: ["shi", "si"] });

  assert.equal(character.previewPattern, "shi");

  assert.deepEqual(character.input("s"), { accepted: true });
  assert.equal(character.typed, "s");
  assert.deepEqual(character.remainingPatterns, ["hi", "i"]);
  assert.equal(character.previewPattern, "shi");
});

test("Character completes when any pattern is fully consumed", () => {
  const character = new Character({ reading: "a", patterns: ["a", "aa"] });

  assert.equal(character.completed, false);
  assert.deepEqual(character.input("a"), { accepted: true });
  assert.equal(character.completed, true);
  assert.deepEqual(character.remainingPatterns, ["", "a"]);
});

test("Character exposes remainingPatterns as a copy", () => {
  const character = new Character({ reading: "a", patterns: ["a"] });
  const remaining = character.remainingPatterns;

  remaining.push("b");
  assert.deepEqual(character.remainingPatterns, ["a"]);
});

test("Character callbacks include timestamps and keys", () => {
  const originalNow = Date.now;
  let now = 0;
  Date.now = () => {
    now += 1;
    return now;
  };

  try {
    const started: { startedAt: number }[] = [];
    const typed: { typedAt: number; key: string }[] = [];
    const mistyped: { typedAt: number; key: string }[] = [];
    const completed: { completedAt: number }[] = [];

    const character = new Character(
      { reading: "a", patterns: ["a"] },
      {
        onCharacterStarted: (payload) => started.push(payload),
        onCharacterTyped: (payload) => typed.push(payload),
        onCharacterMistyped: (payload) => mistyped.push(payload),
        onCharacterCompleted: (payload) => completed.push(payload),
      },
    );

    character.start();
    assert.deepEqual(started, [{ startedAt: 1 }]);

    assert.deepEqual(character.input("x"), { accepted: false });
    assert.deepEqual(mistyped, [{ typedAt: 2, key: "x" }]);

    assert.deepEqual(character.input("a"), { accepted: true });
    assert.deepEqual(typed, [{ typedAt: 3, key: "a" }]);
    assert.deepEqual(completed, [{ completedAt: 3 }]);
  } finally {
    Date.now = originalNow;
  }
});
