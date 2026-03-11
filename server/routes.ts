import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { z } from "zod";
import { insertVocabWrongAnswerSchema } from "@shared/schema";
import { storage } from "./storage";

const dailyQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  userId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/vocab/daily", async (req, res) => {
    const parsed = dailyQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({ message: "date는 YYYY-MM-DD 형식이어야 합니다." });
    }

    const { date, userId } = parsed.data;
    const items = await storage.getDailyVocabSet(date, userId);
    return res.json({ date, items });
  });

  app.post("/api/vocab/wrong-note", async (req, res) => {
    const parsed = insertVocabWrongAnswerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "잘못된 요청 바디입니다.", errors: parsed.error.flatten() });
    }

    const saved = await storage.saveVocabWrongAnswer(parsed.data);
    return res.status(201).json(saved);
  });

  app.get("/api/vocab/wrong-notes", async (req, res) => {
    const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
    const notes = await storage.getVocabWrongAnswers(userId);
    return res.json({ items: notes });
  });

  const httpServer = createServer(app);

  return httpServer;
}
