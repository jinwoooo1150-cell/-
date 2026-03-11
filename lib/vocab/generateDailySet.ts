import type { VocabQuestion } from "@/data/vocabData";

interface GenerateDailySetParams {
  vocabPool: VocabQuestion[];
  date: string;
  userKey: string;
  minQuestions?: number;
  maxQuestions?: number;
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateDailySet({
  vocabPool,
  date,
  userKey,
  minQuestions = 10,
  maxQuestions = 15,
}: GenerateDailySetParams): VocabQuestion[] {
  if (vocabPool.length < 4) return [];

  const seed = hashSeed(`${date}:${userKey}`);
  const random = createSeededRandom(seed);

  const targetSize = Math.max(
    minQuestions,
    Math.min(maxQuestions, vocabPool.length)
  );

  const pickedBase = shuffleWithSeed(vocabPool, random).slice(0, targetSize);

  return pickedBase.map((question, index) => {
    const distractorPool = shuffleWithSeed(
      vocabPool.filter((item) => item.id !== question.id),
      random
    );

    const distractors: string[] = [];
    for (const candidate of distractorPool) {
      if (candidate.meaning === question.meaning) continue;
      if (distractors.includes(candidate.meaning)) continue;
      distractors.push(candidate.meaning);
      if (distractors.length === 3) break;
    }

    if (distractors.length < 3) {
      const fallback = vocabPool
        .map((item) => item.meaning)
        .filter((meaning) => meaning !== question.meaning && !distractors.includes(meaning));
      for (const meaning of fallback) {
        distractors.push(meaning);
        if (distractors.length === 3) break;
      }
    }

    const optionSet = shuffleWithSeed([question.meaning, ...distractors.slice(0, 3)], random);
    const correctIndex = optionSet.findIndex((option) => option === question.meaning);

    return {
      ...question,
      id: `${date}-${index + 1}-${question.id}`,
      options: optionSet,
      correctIndex,
    };
  });
}

