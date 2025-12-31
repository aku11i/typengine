# Typengine

Core library for building typing apps/games on any JavaScript runtime.

## Usage (draft)

```ts
import { Sentence, createJapaneseSentenceDefinition } from "typengine";

const definition = createJapaneseSentenceDefinition("寿司", "すし");
const sentence = new Sentence(definition);

sentence.input("s");
sentence.input("u");
sentence.input("s");
const result = sentence.input("i");
// result example:
// {
//   accepted: boolean; // whether this keystroke was accepted
// }
```

```ts
import { Session, Sentence, createJapaneseSentenceDefinition } from "typengine";

const sentences = [
  new Sentence(createJapaneseSentenceDefinition("寿司", "すし")),
  new Sentence(createJapaneseSentenceDefinition("天ぷら", "てんぷら")),
];

const session = new Session(sentences);
session.start();
session.input("s");
```
