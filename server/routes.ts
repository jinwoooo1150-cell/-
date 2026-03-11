import type { Express } from "express";
import { createServer, type Server } from "node:http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for workflow monitoring
  app.get("/status", (_req, res) => {
    res.status(200).send("packager-status:running");
  });

  // put application routes here
  // prefix all routes with /api

  const httpServer = createServer(app);

  return httpServer;
}
