import type { CharacterDefinition, SentenceDefinition } from "./types.ts";

const KANA_ROMAJI_MAP: Record<string, string[]> = {
  あ: ["a"],
  い: ["i"],
  う: ["u"],
  え: ["e"],
  お: ["o"],
  か: ["ka"],
  き: ["ki"],
  く: ["ku"],
  け: ["ke"],
  こ: ["ko"],
  さ: ["sa"],
  し: ["shi", "si"],
  す: ["su"],
  せ: ["se"],
  そ: ["so"],
  た: ["ta"],
  ち: ["chi", "ti"],
  つ: ["tsu", "tu"],
  て: ["te"],
  と: ["to"],
  な: ["na"],
  に: ["ni"],
  ぬ: ["nu"],
  ね: ["ne"],
  の: ["no"],
  は: ["ha"],
  ひ: ["hi"],
  ふ: ["fu", "hu"],
  へ: ["he"],
  ほ: ["ho"],
  ま: ["ma"],
  み: ["mi"],
  む: ["mu"],
  め: ["me"],
  も: ["mo"],
  や: ["ya"],
  ゆ: ["yu"],
  よ: ["yo"],
  ら: ["ra"],
  り: ["ri"],
  る: ["ru"],
  れ: ["re"],
  ろ: ["ro"],
  わ: ["wa"],
  を: ["wo", "o"],
  ん: ["n"],
  が: ["ga"],
  ぎ: ["gi"],
  ぐ: ["gu"],
  げ: ["ge"],
  ご: ["go"],
  ざ: ["za"],
  じ: ["ji", "zi"],
  ず: ["zu"],
  ぜ: ["ze"],
  ぞ: ["zo"],
  だ: ["da"],
  ぢ: ["ji", "di"],
  づ: ["zu", "du"],
  で: ["de"],
  ど: ["do"],
  ば: ["ba"],
  び: ["bi"],
  ぶ: ["bu"],
  べ: ["be"],
  ぼ: ["bo"],
  ぱ: ["pa"],
  ぴ: ["pi"],
  ぷ: ["pu"],
  ぺ: ["pe"],
  ぽ: ["po"],
  きゃ: ["kya", "kilya", "kixya"],
  きゅ: ["kyu", "kilyu", "kixyu"],
  きょ: ["kyo", "kilyo", "kixyo"],
  ぎゃ: ["gya", "gilya", "gixya"],
  ぎゅ: ["gyu", "gilyu", "gixyu"],
  ぎょ: ["gyo", "gilyo", "gixyo"],
  しゃ: ["sha", "sya", "shilya", "shixya", "silya", "sixya"],
  しゅ: ["shu", "syu", "shilyu", "shixyu", "silyu", "sixyu"],
  しょ: ["sho", "syo", "shilyo", "shixyo", "silyo", "sixyo"],
  じゃ: ["ja", "jya", "zya", "jilya", "jixya", "zilya", "zixya"],
  じゅ: ["ju", "jyu", "zyu", "jilyu", "jixyu", "zilyu", "zixyu"],
  じょ: ["jo", "jyo", "zyo", "jilyo", "jixyo", "zilyo", "zixyo"],
  ちゃ: ["cha", "cya", "tya", "chilya", "chixya", "tilya", "tixya"],
  ちゅ: ["chu", "cyu", "tyu", "chilyu", "chixyu", "tilyu", "tixyu"],
  ちょ: ["cho", "cyo", "tyo", "chilyo", "chixyo", "tilyo", "tixyo"],
  にゃ: ["nya", "nilya", "nixya"],
  にゅ: ["nyu", "nilyu", "nixyu"],
  にょ: ["nyo", "nilyo", "nixyo"],
  ひゃ: ["hya", "hilya", "hixya"],
  ひゅ: ["hyu", "hilyu", "hixyu"],
  ひょ: ["hyo", "hilyo", "hixyo"],
  みゃ: ["mya", "milya", "mixya"],
  みゅ: ["myu", "milyu", "mixyu"],
  みょ: ["myo", "milyo", "mixyo"],
  りゃ: ["rya", "rilya", "rixya"],
  りゅ: ["ryu", "rilyu", "rixyu"],
  りょ: ["ryo", "rilyo", "rixyo"],
  びゃ: ["bya", "bilya", "bixya"],
  びゅ: ["byu", "bilyu", "bixyu"],
  びょ: ["byo", "bilyo", "bixyo"],
  ぴゃ: ["pya", "pilya", "pixya"],
  ぴゅ: ["pyu", "pilyu", "pixyu"],
  ぴょ: ["pyo", "pilyo", "pixyo"],
  // Punctuation and symbols
  "、": [","],
  "。": ["."],
  "！": ["!"],
  "？": ["?"],
  "ー": ["-"],
  "「": ["["],
  "」": ["]"],
  "・": ["/"],
  "～": ["~"],
  "〜": ["~"],
  "：": [":"],
  "；": [";"],
  "（": ["("],
  "）": [")"],
  "【": ["["],
  "】": ["]"],
  "『": ["["],
  "』": ["]"],
};

const SMALL_TSU_PATTERNS = ["ltu", "ltsu", "xtu", "xtsu"];
const SMALL_TSU_CONSONANTS = new Set(["k", "s", "t", "h", "m", "y", "r", "w"]);

const createSmallTsuCharacterDefinition = (
  nextPatterns: string[] | undefined,
): CharacterDefinition => {
  const consonantPatterns = new Set<string>();

  if (nextPatterns) {
    for (const pattern of nextPatterns) {
      const consonant = pattern[0];
      if (consonant && SMALL_TSU_CONSONANTS.has(consonant)) {
        consonantPatterns.add(consonant);
      }
    }
  }

  return {
    reading: "っ",
    patterns: [...SMALL_TSU_PATTERNS, ...consonantPatterns],
  };
};

export const createJapaneseSentenceDefinition = (
  text: string,
  reading: string,
): SentenceDefinition => {
  const characters: SentenceDefinition["characters"] = [];

  for (let index = 0; index < reading.length; index += 1) {
    const char = reading[index];
    const nextChar = reading[index + 1];

    if (char === "っ") {
      const nextPatterns = nextChar ? KANA_ROMAJI_MAP[nextChar] : undefined;
      characters.push(createSmallTsuCharacterDefinition(nextPatterns));
      continue;
    }

    const digraph = nextChar ? `${char}${nextChar}` : null;
    const digraphCandidates = digraph ? KANA_ROMAJI_MAP[digraph] : undefined;
    const candidates = digraphCandidates ?? KANA_ROMAJI_MAP[char];

    if (!candidates) {
      throw new Error(`Unsupported hiragana: ${char}`);
    }

    const readingUnit = digraphCandidates && nextChar ? `${char}${nextChar}` : char;
    if (digraphCandidates) {
      index += 1;
    }

    characters.push({
      reading: readingUnit,
      patterns: candidates,
    });
  }

  return {
    text,
    reading,
    characters,
  };
};
