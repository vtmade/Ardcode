import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway (only for API requests)
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      message: "Ardcode server is running",
      timestamp: new Date().toISOString()
    });
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
