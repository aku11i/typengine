import assert from "node:assert/strict";
import test from "node:test";

import { Sentence } from "./sentence.ts";
import { Session } from "./session.ts";

test("Session advances sentences and auto-starts the next sentence", () => {
  const events: string[] = [];

  const sentence1 = new Sentence(
    {
      text: "a",
      reading: "a",
      characters: [{ reading: "a", patterns: ["a"] }],
    },
    {
      onSentenceStarted: () => events.push("sentence1-start"),
    },
  );

  const sentence2 = new Sentence(
    {
      text: "b",
      reading: "b",
      characters: [{ reading: "b", patterns: ["b"] }],
    },
    {
      onSentenceStarted: () => events.push("sentence2-start"),
    },
  );

  const session = new Session([sentence1, sentence2], {
    onSessionStarted: () => events.push("session-start"),
    onSessionCompleted: () => events.push("session-complete"),
  });

  session.start();
  assert.deepEqual(events, ["session-start", "sentence1-start"]);

  assert.deepEqual(session.input("x"), {
    accepted: false,
    completed: false,
    sentenceCompleted: false,
    remaining: ["a"],
  });
  assert.equal(session.position, 0);
  assert.deepEqual(events, ["session-start", "sentence1-start"]);

  assert.deepEqual(session.input("a"), {
    accepted: true,
    completed: false,
    sentenceCompleted: true,
    remaining: ["b"],
  });
  assert.equal(session.position, 1);
  assert.equal(session.currentSentence, sentence2);
  assert.deepEqual(events, ["session-start", "sentence1-start", "sentence2-start"]);

  assert.deepEqual(session.input("b"), {
    accepted: true,
    completed: true,
    sentenceCompleted: true,
    remaining: [""],
  });
  assert.equal(session.completed, true);
  assert.deepEqual(events, [
    "session-start",
    "sentence1-start",
    "sentence2-start",
    "session-complete",
  ]);
});

test("Session requires at least one sentence", () => {
  assert.throws(() => new Session([]), /Session requires at least one sentence/);
});
