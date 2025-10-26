import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { annotationSchema, bookmarkSchema, learningFormatSchema, studentInteractionSchema } from "@shared/schema";
import { z } from "zod";
import { Readable } from "stream";

export async function registerRoutes(app: Express): Promise<Server> {
  const analyzeLearningRequestSchema = z.object({
    sectionId: z.union([z.string(), z.number()]),
    sectionTitle: z.string().optional(),
    sectionContent: z.string().min(1, "Section content is required"),
    contentMetadata: z.object({
      complexity: z.enum(["abstract", "conceptual", "concrete", "factual"]).optional(),
      contentType: z.enum(["procedural", "spatial", "mathematical", "narrative", "expository", "mixed"]).optional(),
      keywords: z.array(z.string()).max(12).optional(),
      length: z.number().int().positive().optional(),
      readingLevel: z.enum(["elementary", "middle", "high", "college", "professional"]).optional(),
    }).partial().optional(),
    studentHistory: z.array(
      studentInteractionSchema.omit({
        id: true,
        interactedAt: true,
      }).extend({
        interactedAt: z.string().optional(),
      })
    ).optional(),
  });

  async function callNemotronAnalysis(model: string, payload: unknown, apiKey: string) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Torka Adaptive Reader",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 512,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: [
                  "You are an adaptive learning analyst assisting an educational reading platform.",
                  "Analyze the provided content and student interaction history to determine whether a visual or audio format best fits the concept being learned.",
                  "Base the recommendation on the concept and metadata: choose visual when diagrams or spatial reasoning aid comprehension; choose audio when narrative pacing or spoken explanation is more effective.",
                  "Return a JSON object with keys format, reasoning, confidence.",
                  "format must be exactly one of: visual or audio. Never list multiple formats or ranges.",
                  "reasoning must be concise under 200 characters.",
                  "confidence must be a float between 0 and 1.",
                ].join(" "),
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: JSON.stringify(payload),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Nemotron request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const rawContent: string | undefined = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error("Nemotron response missing content");
    }

    return rawContent;
  }

  function parseNemotronResponse(content: string) {
    const trimmed = content.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
    const parsed = JSON.parse(trimmed);
    const result = z.object({
      format: learningFormatSchema,
      reasoning: z.string(),
      confidence: z.number().min(0).max(1),
    }).parse(parsed);
    return result;
  }

  const interactionInputSchema = studentInteractionSchema.omit({
    id: true,
    interactedAt: true,
  }).extend({
    interactedAt: z.string().optional(),
  });

  app.post("/api/interactions", async (req, res) => {
    try {
      const interaction = interactionInputSchema.parse(req.body);
      const stored = await storage.recordInteraction(interaction);
      res.json(stored);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to record interaction" });
      }
    }
  });

  app.get("/api/interactions", async (_req, res) => {
    try {
      const interactions = await storage.getInteractions();
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interactions" });
    }
  });

  app.get("/api/interactions/:sectionId", async (req, res) => {
    try {
      const { sectionId } = req.params;
      const normalizedId = Number.isNaN(Number(sectionId)) ? sectionId : Number(sectionId);
      const interactions = await storage.getInteractionsBySection(normalizedId);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interactions" });
    }
  });

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

  // Text-to-image with Gemini
  app.post("/api/text-to-image", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      // Using Gemini's image generation model
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent";

      // Create a prompt that asks for a helpful diagram
      const prompt = `Generate a helpful diagram for content using style of 2d graphics:
# Content
${text}`;

      const response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Gemini API error:", error);
        return res.status(response.status).json({ error: "Failed to generate image" });
      }

      const data = await response.json();
      
      // Extract the image data from the response
      if (data.candidates && data.candidates[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Return the base64 image data
            const imageBuffer = Buffer.from(part.inlineData.data, "base64");
            res.setHeader("Content-Type", "image/png");
            res.send(imageBuffer);
            return;
          }
        }
      }

      res.status(500).json({ error: "No image data received" });
    } catch (error) {
      console.error("Text-to-image error:", error);
      res.status(500).json({ error: "Failed to generate image" });
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

  app.post("/api/analyze-learning-format", async (req, res) => {
    try {
      const parsed = analyzeLearningRequestSchema.parse(req.body);

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" });
      }

      const preferredModel = process.env.OPENROUTER_MODEL ?? "nvidia/llama-3.1-nemotron-70b-instruct";
      const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL ?? "nvidia/nemotron-4-340b-instruct";

      const storedHistory = await storage.getInteractionsBySection(parsed.sectionId);
      const combinedHistory = [
        ...(parsed.studentHistory ?? []),
        ...storedHistory.map(({ id: _id, ...rest }) => rest),
      ];

      const promptPayload = {
        task: "Recommend optimal learning format",
        section: {
          id: parsed.sectionId,
          title: parsed.sectionTitle,
          content: parsed.sectionContent,
          metadata: parsed.contentMetadata,
        },
        studentHistory: combinedHistory,
        guidance: {
          formatOptions: learningFormatSchema.options,
          considerations: [
            "Match instructional format to content complexity and type",
            "Account for student performance signals and preferences",
            "Balance novelty with consistency when confidence is low",
          ],
        },
      };

      let responseContent: string | undefined;
      let attemptModel = preferredModel;
      try {
        responseContent = await callNemotronAnalysis(attemptModel, promptPayload, apiKey);
      } catch (error) {
        if (fallbackModel && fallbackModel !== preferredModel) {
          attemptModel = fallbackModel;
          responseContent = await callNemotronAnalysis(attemptModel, promptPayload, apiKey);
        } else {
          throw error;
        }
      }

      const parsedResponse = parseNemotronResponse(responseContent);
      res.json({
        ...parsedResponse,
        model: attemptModel,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else if (error instanceof Error) {
        console.error("Analyze learning format error:", error.message);
        res.status(502).json({ error: "Failed to analyze learning format" });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  });

  // Quiz submission endpoint - proxies to external API
  app.post("/api/submit", async (req, res) => {
    try {
      const submissionSchema = z.object({
        sectionId: z.number(),
        score: z.number().min(0).max(1),
        timestamp: z.string().optional(),
        format: z.enum(["visual", "audio"]).optional(),
      });

      const submission = submissionSchema.parse(req.body);
      
      // Map internal format to external API enum
      const formatMap: Record<string, string> = {
        "visual": "IMAGE",
        "audio": "AUDIO",
      };
      const apiFormat = formatMap[submission.format ?? "visual"] ?? "IMAGE";
      
      // Forward the request to the external API with required fields
      const externalResponse = await fetch("https://aitxhackathon-production.up.railway.app/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionId: submission.sectionId,
          score: submission.score,
          timestamp: submission.timestamp ?? new Date().toISOString(),
          type: apiFormat,
          correct: submission.score === 1,
        }),
      });

      if (!externalResponse.ok) {
        const errorText = await externalResponse.text();
        console.error("External API error:", errorText);
        return res.status(externalResponse.status).json({ 
          error: "External API request failed",
          details: errorText 
        });
      }

      const data = await externalResponse.json();
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Quiz submission error:", error);
        res.status(500).json({ error: "Failed to submit quiz" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
