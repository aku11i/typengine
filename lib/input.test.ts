import assert from "node:assert/strict";
import test from "node:test";

import { input } from "./input.ts";

test("input advances matching patterns and appends typed value", () => {
  const state = {
    remainingPatterns: ["shi", "si"],
    typedValue: "",
  };

  assert.deepEqual(input(state, "s"), { accepted: true });
  assert.deepEqual(state.remainingPatterns, ["hi", "i"]);
  assert.equal(state.typedValue, "s");
});

test("input rejects non-matching values without mutating state", () => {
  const state = {
    remainingPatterns: ["a"],
    typedValue: "",
  };

  assert.deepEqual(input(state, "b"), { accepted: false });
  assert.deepEqual(state.remainingPatterns, ["a"]);
  assert.equal(state.typedValue, "");
});

test("input rejects when any pattern is already completed", () => {
  const state = {
    remainingPatterns: [""],
    typedValue: "a",
  };

  assert.deepEqual(input(state, "a"), { accepted: false });
  assert.deepEqual(state.remainingPatterns, [""]);
  assert.equal(state.typedValue, "a");
});
