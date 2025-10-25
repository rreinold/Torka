import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { annotationSchema, bookmarkSchema } from "@shared/schema";
import { z } from "zod";
import { Readable } from "stream";

export async function registerRoutes(app: Express): Promise<Server> {
  // Annotations
  app.get("/api/annotations", async (req, res) => {
    try {
      const annotations = await storage.getAnnotations();
      res.json(annotations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch annotations" });
    }
  });

  app.post("/api/annotations", async (req, res) => {
    try {
      const data = annotationSchema.omit({ id: true, createdAt: true }).parse(req.body);
      const annotation = await storage.createAnnotation(data);
      res.json(annotation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create annotation" });
      }
    }
  });

  app.delete("/api/annotations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAnnotation(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Annotation not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete annotation" });
    }
  });

  // Bookmarks
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const data = bookmarkSchema.omit({ id: true, createdAt: true }).parse(req.body);
      const bookmark = await storage.createBookmark(data);
      res.json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create bookmark" });
      }
    }
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteBookmark(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Bookmark not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bookmark" });
    }
  });

  // Notes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      if (typeof content !== "string") {
        return res.status(400).json({ error: "Content must be a string" });
      }
      
      const note = await storage.updateNote(id, content);
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  // Text-to-speech with ElevenLabs
  app.post("/api/text-to-speech", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "ElevenLabs API key not configured" });
      }

      // Using ElevenLabs' default voice (Rachel)
      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("ElevenLabs API error:", error);
        return res.status(response.status).json({ error: "Failed to generate speech" });
      }

      // Stream the audio response
      res.setHeader("Content-Type", "audio/mpeg");
      
      if (response.body) {
        const reader = response.body.getReader();
        const stream = new Readable({
          async read() {
            const { done, value } = await reader.read();
            if (done) {
              this.push(null);
            } else {
              this.push(Buffer.from(value));
            }
          },
        });
        stream.pipe(res);
      } else {
        res.status(500).json({ error: "No audio data received" });
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
