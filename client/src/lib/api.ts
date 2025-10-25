import type { Annotation, Bookmark, Note } from "@shared/schema";

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
