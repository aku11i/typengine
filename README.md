# typing-engine

Core library for building typing apps/games on any JavaScript runtime.

## Usage (draft)

```ts
import { Sentence } from "typing-engine";

const sentence = new Sentence({
  text: "寿司",
  reading: "すし",
  patterns: ["sushi", "susi"],
});

sentence.input("s");
sentence.input("u");
sentence.input("s");
const result = sentence.input("i");
// result example:
// {
//   accepted: boolean;   // whether this keystroke was accepted
//   completed: boolean;  // whether the whole sentence is completed
//   remaining: string[]; // currently valid patterns (remaining strings)
// }
```
