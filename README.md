# typing-engine

Core library for building typing apps/games on any JavaScript runtime.

## Usage (draft)

```ts
import { Sentence, createJapaneseSentenceDefinition } from "typing-engine";

const definition = createJapaneseSentenceDefinition("寿司", "すし");
const sentence = new Sentence(definition);

sentence.start();
sentence.input("s");
sentence.input("u");
sentence.input("s");
const result = sentence.input("i");
// result example:
// {
//   accepted: boolean;   // whether this keystroke was accepted
//   completed: boolean;  // whether the whole sentence is completed
//   remaining: string[]; // currently valid patterns for the current character
//   inputAt: string; // ISOString when this input is attempted
// }
```
