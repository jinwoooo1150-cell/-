import {
  type User,
  type InsertUser,
  type InsertVocabWrongAnswer,
  type VocabWrongAnswer,
} from "@shared/schema";
import { randomUUID } from "crypto";

type SeedVocab = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  difficulty: number;
  tags: string[];
  explanation: string;
  isActive: boolean;
};

export type DailyVocabQuestion = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  difficulty: number;
  tags: string[];
  explanation: string;
  options: string[];
  correctIndex: number;
};

const seedClassicVocab: SeedVocab[] = [
  { id: "cv-1", word: "얄리얄리", meaning: "고려가요의 후렴구", example: "얄리얄리 얄랑셩", difficulty: 1, tags: ["고려가요"], explanation: "'얄리얄리'는 고려가요에서 반복되는 후렴구를 뜻합니다.", isActive: true },
  { id: "cv-2", word: "님", meaning: "사랑하는 사람·그리운 대상", example: "님이 오마 하거늘", difficulty: 1, tags: ["정서"], explanation: "'님'은 사랑하거나 그리워하는 대상을 의미합니다.", isActive: true },
  { id: "cv-3", word: "시름", meaning: "근심·걱정·슬픔", example: "시름 한 나도 자고", difficulty: 1, tags: ["감정"], explanation: "'시름'은 근심과 걱정 같은 부정적 정서를 통칭합니다.", isActive: true },
  { id: "cv-4", word: "가시리", meaning: "떠나시렵니까", example: "가시리 가시리잇고", difficulty: 2, tags: ["고어"], explanation: "'가시리'는 상대의 떠남을 묻는 표현입니다.", isActive: true },
  { id: "cv-5", word: "녹수청산", meaning: "푸른 물과 푸른 산", example: "녹수청산에 놀자 하니", difficulty: 2, tags: ["한자어"], explanation: "'녹수청산'은 아름다운 자연 풍경을 가리킵니다.", isActive: true },
  { id: "cv-6", word: "후렴구", meaning: "각 절 끝에 반복되는 구절", example: "위 두어렁셩", difficulty: 1, tags: ["형식"], explanation: "후렴구는 노래의 반복 구절로 리듬을 만듭니다.", isActive: true },
  { id: "cv-7", word: "하노라", meaning: "~하고 있습니다", example: "하노라", difficulty: 2, tags: ["어미"], explanation: "'하노라'는 진행이나 진술을 나타내는 고전 어미입니다.", isActive: true },
  { id: "cv-8", word: "도란", meaning: "모두·전부", example: "도란 님을 여의고", difficulty: 2, tags: ["고어"], explanation: "'도란'은 모두/전부라는 뜻의 고어입니다.", isActive: true },
  { id: "cv-9", word: "여음", meaning: "의미 없이 반복되는 음절", example: "얄리얄리", difficulty: 2, tags: ["고려가요"], explanation: "여음은 의미보다 운율을 위해 반복되는 음절입니다.", isActive: true },
  { id: "cv-10", word: "속요", meaning: "고려 시대 평민의 노래", example: "청산별곡", difficulty: 1, tags: ["갈래"], explanation: "속요는 고려 시대 민중 사이에서 불린 노래입니다.", isActive: true },
];

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDailyVocabSet(date: string, userId?: string): Promise<DailyVocabQuestion[]>;
  saveVocabWrongAnswer(note: InsertVocabWrongAnswer): Promise<VocabWrongAnswer>;
  getVocabWrongAnswers(userId?: string): Promise<VocabWrongAnswer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vocab: SeedVocab[];
  private dailySetByUserAndDate: Map<string, string[]>;
  private vocabWrongAnswers: Map<string, VocabWrongAnswer>;

  constructor() {
    this.users = new Map();
    this.vocab = seedClassicVocab;
    this.dailySetByUserAndDate = new Map();
    this.vocabWrongAnswers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDailyVocabSet(date: string, userId = "anonymous"): Promise<DailyVocabQuestion[]> {
    const key = `${userId}:${date}`;
    let selectedIds = this.dailySetByUserAndDate.get(key);

    if (!selectedIds) {
      const active = this.vocab.filter((item) => item.isActive);
      selectedIds = this.pickRandom(active, 5).map((item) => item.id);
      this.dailySetByUserAndDate.set(key, selectedIds);
    }

    const selected = selectedIds
      .map((id) => this.vocab.find((item) => item.id === id))
      .filter((item): item is SeedVocab => Boolean(item));

    return selected.map((item) => {
      const distractors = this.pickRandom(this.vocab.filter((v) => v.id !== item.id), 3).map((v) => v.meaning);
      const options = this.shuffle([item.meaning, ...distractors]);

      return {
        id: item.id,
        word: item.word,
        meaning: item.meaning,
        example: item.example,
        difficulty: item.difficulty,
        tags: item.tags,
        explanation: item.explanation,
        options,
        correctIndex: options.findIndex((opt) => opt === item.meaning),
      };
    });
  }

  async saveVocabWrongAnswer(note: InsertVocabWrongAnswer): Promise<VocabWrongAnswer> {
    const id = randomUUID();
    const createdAt = new Date();

    const saved: VocabWrongAnswer = {
      id,
      userId: note.userId,
      vocabId: note.vocabId,
      word: note.word,
      statement: note.statement,
      userAnswer: note.userAnswer,
      correctAnswer: note.correctAnswer,
      explanation: note.explanation,
      noteType: note.noteType ?? "vocab",
      isActive: true,
      createdAt,
    };

    this.vocabWrongAnswers.set(id, saved);
    return saved;
  }

  async getVocabWrongAnswers(userId = "anonymous"): Promise<VocabWrongAnswer[]> {
    return Array.from(this.vocabWrongAnswers.values())
      .filter((item) => item.userId === userId && item.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    return this.shuffle([...arr]).slice(0, Math.min(count, arr.length));
  }

  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

export const storage = new MemStorage();
