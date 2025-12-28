import assert from "node:assert/strict";
import test from "node:test";

import { Character } from "./character.ts";

test("Character input records completedAt on completion", () => {
  const character = new Character({ reading: "a", patterns: ["a"] });

  const result = character.input("a");
  assert.equal(result.accepted, true);
  assert.equal(result.completed, true);
  assert.ok(result.inputAt);
  assert.equal(character.completedAt, result.inputAt);

  const again = character.input("a");
  assert.equal(again.accepted, false);
  assert.equal(again.completed, true);
  assert.ok(again.inputAt);
  assert.equal(character.completedAt, again.inputAt);
});
