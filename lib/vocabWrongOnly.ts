import { IncorrectNote } from "@/contexts/StudyContext";

export interface WrongOnlyVocabQuestion {
  id: string;
  sourceQuestionId: string;
  word: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  example: string;
}

const FALLBACK_DISTRACTORS = [
  "화자의 정서와 무관한 표현",
  "자연물을 의인화한 상징",
  "부정적 현실을 비판하는 태도",
  "임을 향한 간절한 그리움",
  "풍류적 태도를 드러낸 표현",
  "서경적 묘사를 통한 분위기 형성",
];

const cleanWordFromStatement = (statement: string) => {
  const match = statement.match(/"(.+?)"/);
  return match?.[1] ?? statement.replace(/의 뜻은\?/g, "").trim();
};

const shuffle = <T,>(list: T[]) => {
  const copied = [...list];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

const pickDistractors = (correctAnswer: string, pool: string[], exclude?: string) => {
  const candidates = shuffle(pool.filter((item) => item !== correctAnswer && item !== exclude));
  const picked = candidates.slice(0, 3);

  if (picked.length < 3) {
    const fallback = FALLBACK_DISTRACTORS.filter((item) => item !== correctAnswer && item !== exclude);
    picked.push(...shuffle(fallback).slice(0, 3 - picked.length));
  }

  return picked;
};

export function buildWrongOnlyVocabQuestions(notes: IncorrectNote[]): WrongOnlyVocabQuestion[] {
  const vocabNotes = notes.filter((note) => note.correctAnswer && (note.noteType === "vocab" || note.questionId.startsWith("vocab-")));
  if (vocabNotes.length === 0) return [];

  const answerPool = Array.from(new Set(vocabNotes.map((note) => note.correctAnswer!)));

  return vocabNotes.map((note) => {
    const correctAnswer = note.correctAnswer!;
    const distractors = pickDistractors(correctAnswer, answerPool, note.userAnswer);
    const options = shuffle([correctAnswer, ...distractors]).slice(0, 4);

    return {
      id: `wrong-${note.questionId}`,
      sourceQuestionId: note.questionId,
      word: note.quizAuthor || cleanWordFromStatement(note.statement),
      options,
      correctIndex: options.indexOf(correctAnswer),
      explanation: note.explanation,
      example: note.statement,
    };
  });
}
