import assert from "node:assert/strict";
import test from "node:test";

import { createJapaneseSentenceDefinition } from "./createJapaneseSentenceDefinition.ts";

test("createJapaneseSentenceDefinition builds patterns from hiragana", () => {
  const definition = createJapaneseSentenceDefinition("寿司が食べたい", "すしがたべたい");

  assert.deepEqual(definition, {
    text: "寿司が食べたい",
    reading: "すしがたべたい",
    characters: [
      { reading: "す", patterns: ["su"] },
      { reading: "し", patterns: ["shi", "si"] },
      { reading: "が", patterns: ["ga"] },
      { reading: "た", patterns: ["ta"] },
      { reading: "べ", patterns: ["be"] },
      { reading: "た", patterns: ["ta"] },
      { reading: "い", patterns: ["i"] },
    ],
  });
});

test("createJapaneseSentenceDefinition maps basic kana to characters", () => {
  const definition = createJapaneseSentenceDefinition("あいう", "あいう");

  assert.equal(definition.characters.length, 3);
  assert.deepEqual(definition.characters[0], { reading: "あ", patterns: ["a"] });
  assert.deepEqual(definition.characters[1], { reading: "い", patterns: ["i"] });
  assert.deepEqual(definition.characters[2], { reading: "う", patterns: ["u"] });
});

test("createJapaneseSentenceDefinition supports yoon combinations", () => {
  const definition = createJapaneseSentenceDefinition("じゃじゅじょ", "じゃじゅじょ");

  assert.equal(definition.characters.length, 3);
  assert.equal(definition.characters[0].reading, "じゃ");
  assert.equal(definition.characters[1].reading, "じゅ");
  assert.equal(definition.characters[2].reading, "じょ");

  assert.ok(definition.characters[0].patterns.includes("ja"));
  assert.ok(definition.characters[0].patterns.includes("jilya"));
  assert.ok(definition.characters[0].patterns.includes("zixya"));

  assert.ok(definition.characters[1].patterns.includes("ju"));
  assert.ok(definition.characters[1].patterns.includes("jilyu"));
  assert.ok(definition.characters[1].patterns.includes("zixyu"));

  assert.ok(definition.characters[2].patterns.includes("jo"));
  assert.ok(definition.characters[2].patterns.includes("jilyo"));
  assert.ok(definition.characters[2].patterns.includes("zixyo"));
});

test("createJapaneseSentenceDefinition supports base+small variants for other yoon", () => {
  const definition = createJapaneseSentenceDefinition("きゃ", "きゃ");

  assert.equal(definition.characters.length, 1);
  assert.ok(definition.characters[0].patterns.includes("kya"));
  assert.ok(definition.characters[0].patterns.includes("kilya"));
  assert.ok(definition.characters[0].patterns.includes("kixya"));
});

test("createJapaneseSentenceDefinition keeps yoon as a single character", () => {
  const definition = createJapaneseSentenceDefinition("きゃく", "きゃく");

  assert.equal(definition.characters.length, 2);
  assert.equal(definition.characters[0].reading, "きゃ");
  assert.equal(definition.characters[1].reading, "く");
  assert.ok(definition.characters[0].patterns.includes("kya"));
  assert.ok(definition.characters[1].patterns.includes("ku"));
});

test("createJapaneseSentenceDefinition preserves multiple romanization options", () => {
  const definition = createJapaneseSentenceDefinition("しをん", "しをん");

  assert.equal(definition.characters.length, 3);
  assert.ok(definition.characters[0].patterns.includes("shi"));
  assert.ok(definition.characters[0].patterns.includes("si"));
  assert.ok(definition.characters[1].patterns.includes("wo"));
  assert.ok(definition.characters[1].patterns.includes("o"));
  assert.ok(definition.characters[2].patterns.includes("n"));
});

test("createJapaneseSentenceDefinition adds consonant patterns for small tsu", () => {
  const definition = createJapaneseSentenceDefinition("わっか", "わっか");

  assert.equal(definition.characters.length, 3);
  assert.equal(definition.characters[1].reading, "っ");
  assert.ok(definition.characters[1].patterns.includes("k"));
  assert.ok(definition.characters[1].patterns.includes("ltu"));
  assert.ok(definition.characters[1].patterns.includes("xtsu"));
});

test("createJapaneseSentenceDefinition throws on unsupported hiragana", () => {
  assert.throws(() => createJapaneseSentenceDefinition("ぁ", "ぁ"), /Unsupported hiragana/);
});

test("createJapaneseSentenceDefinition supports Japanese punctuation", () => {
  const definition = createJapaneseSentenceDefinition("こんにちは、元気ですか？", "こんにちは、げんきですか？");

  assert.equal(definition.characters.length, 13);
  assert.deepEqual(definition.characters[5], { reading: "、", patterns: [","] });
  assert.deepEqual(definition.characters[12], { reading: "？", patterns: ["?"] });
});

test("createJapaneseSentenceDefinition supports Japanese symbols", () => {
  const definition = createJapaneseSentenceDefinition("ラーメン！", "らーめん！");

  assert.equal(definition.characters.length, 5);
  assert.deepEqual(definition.characters[0], { reading: "ら", patterns: ["ra"] });
  assert.deepEqual(definition.characters[1], { reading: "ー", patterns: ["-"] });
  assert.deepEqual(definition.characters[2], { reading: "め", patterns: ["me"] });
  assert.deepEqual(definition.characters[3], { reading: "ん", patterns: ["n"] });
  assert.deepEqual(definition.characters[4], { reading: "！", patterns: ["!"] });
});

test("createJapaneseSentenceDefinition supports sentence with period", () => {
  const definition = createJapaneseSentenceDefinition("わかりました。", "わかりました。");

  assert.equal(definition.characters.length, 7);
  assert.deepEqual(definition.characters[6], { reading: "。", patterns: ["."] });
});

test("createJapaneseSentenceDefinition supports various brackets", () => {
  const definition = createJapaneseSentenceDefinition("「こんにちは」", "「こんにちは」");

  assert.equal(definition.characters.length, 7);
  assert.deepEqual(definition.characters[0], { reading: "「", patterns: ["["] });
  assert.deepEqual(definition.characters[6], { reading: "」", patterns: ["]"] });
});
