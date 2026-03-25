import type { ClassicVocabEntry, VocabQuestion } from "@/data/vocabData";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateDaySet(
  day: number,
  allVocab: ClassicVocabEntry[]
): VocabQuestion[] {
  const dayVocab = allVocab.filter((v) => v.day === day);
  if (dayVocab.length === 0) return [];
  if (allVocab.length < 4) return [];

  const questions = shuffle(dayVocab);

  return questions.map((question) => {
    const distractorPool = shuffle(
      allVocab.filter((v) => v.id !== question.id)
    );

    const distractors: string[] = [];
    for (const candidate of distractorPool) {
      if (candidate.meaning === question.meaning) continue;
      if (distractors.includes(candidate.meaning)) continue;
      distractors.push(candidate.meaning);
      if (distractors.length === 3) break;
    }

    const optionSet = shuffle([question.meaning, ...distractors.slice(0, 3)]);
    const correctIndex = optionSet.indexOf(question.meaning);

    return {
      ...question,
      options: optionSet,
      correctIndex,
    };
  });
}

export function getTotalDays(allVocab: ClassicVocabEntry[]): number {
  const days = new Set(allVocab.map((v) => v.day));
  return Math.max(...days);
}
