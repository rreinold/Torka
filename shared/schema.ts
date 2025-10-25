import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const annotationTypeSchema = z.enum(['highlight', 'underline', 'strikethrough', 'note', 'drawing', 'shape', 'textbox']);
export const highlightColorSchema = z.enum(['yellow', 'green', 'blue', 'pink', 'orange']);

export const annotationSchema = z.object({
  id: z.string(),
  type: annotationTypeSchema,
  pageNumber: z.number(),
  color: highlightColorSchema.optional(),
  content: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  textSelection: z.object({
    start: z.number(),
    end: z.number(),
    text: z.string(),
  }).optional(),
  createdAt: z.string(),
});

export const bookmarkSchema = z.object({
  id: z.string(),
  label: z.string(),
  pageNumber: z.number(),
  createdAt: z.string(),
});

export const noteSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const learningFormatSchema = z.enum(["text", "visual", "audio", "multimodal"]);

export const studentInteractionSchema = z.object({
  id: z.string(),
  sectionId: z.union([z.string(), z.number()]),
  formatUsed: learningFormatSchema,
  timeSpentMs: z.number().int().nonnegative(),
  quizScore: z.number().min(0).max(1).nullable(),
  completed: z.boolean(),
  interactedAt: z.string(),
});

export type Annotation = z.infer<typeof annotationSchema>;
export type AnnotationType = z.infer<typeof annotationTypeSchema>;
export type HighlightColor = z.infer<typeof highlightColorSchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type Note = z.infer<typeof noteSchema>;
export type LearningFormat = z.infer<typeof learningFormatSchema>;
export type StudentInteraction = z.infer<typeof studentInteractionSchema>;
