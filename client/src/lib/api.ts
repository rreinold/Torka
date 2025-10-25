import type { Annotation, Bookmark, Note, LearningFormat, StudentInteraction } from "@shared/schema";

// Annotations
export async function fetchAnnotations(): Promise<Annotation[]> {
  const response = await fetch("/api/annotations");
  if (!response.ok) throw new Error("Failed to fetch annotations");
  return response.json();
}

export async function createAnnotation(
  annotation: Omit<Annotation, "id" | "createdAt">
): Promise<Annotation> {
  const response = await fetch("/api/annotations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(annotation),
  });
  if (!response.ok) throw new Error("Failed to create annotation");
  return response.json();
}

export async function deleteAnnotation(id: string): Promise<void> {
  const response = await fetch(`/api/annotations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete annotation");
}

// Bookmarks
export async function fetchBookmarks(): Promise<Bookmark[]> {
  const response = await fetch("/api/bookmarks");
  if (!response.ok) throw new Error("Failed to fetch bookmarks");
  return response.json();
}

export async function createBookmark(
  bookmark: Omit<Bookmark, "id" | "createdAt">
): Promise<Bookmark> {
  const response = await fetch("/api/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookmark),
  });
  if (!response.ok) throw new Error("Failed to create bookmark");
  return response.json();
}

export async function deleteBookmark(id: string): Promise<void> {
  const response = await fetch(`/api/bookmarks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete bookmark");
}

// Notes
export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes");
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
}

export async function updateNote(id: string, content: string): Promise<Note> {
  const response = await fetch(`/api/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
}

interface AnalyzeLearningFormatPayload {
  sectionId: string | number;
  sectionTitle?: string;
  sectionContent: string;
  contentMetadata?: {
    complexity?: "abstract" | "conceptual" | "concrete" | "factual";
    contentType?: "procedural" | "spatial" | "mathematical" | "narrative" | "expository" | "mixed";
    keywords?: string[];
    length?: number;
    readingLevel?: "elementary" | "middle" | "high" | "college" | "professional";
  };
  studentHistory?: Array<Omit<StudentInteraction, "id" | "interactedAt"> & Partial<Pick<StudentInteraction, "interactedAt">>>;
}

interface AnalyzeLearningFormatResponse {
  format: LearningFormat;
  reasoning: string;
  confidence: number;
  model: string;
}

export async function analyzeLearningFormat(payload: AnalyzeLearningFormatPayload): Promise<AnalyzeLearningFormatResponse> {
  const response = await fetch("/api/analyze-learning-format", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to analyze learning format");
  return response.json();
}

type InteractionInput = Omit<StudentInteraction, "id" | "interactedAt"> & Partial<Pick<StudentInteraction, "interactedAt">>;

export async function recordInteraction(interaction: InteractionInput): Promise<StudentInteraction> {
  const response = await fetch("/api/interactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(interaction),
  });
  if (!response.ok) throw new Error("Failed to record interaction");
  return response.json();
}
