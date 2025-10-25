import { type User, type InsertUser, type Annotation, type Bookmark, type Note, annotations, bookmarks, notes, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Annotations
  getAnnotations(): Promise<Annotation[]>;
  createAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation>;
  deleteAnnotation(id: string): Promise<boolean>;
  
  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;
  
  // Notes
  getNotes(): Promise<Note[]>;
  updateNote(id: string, content: string): Promise<Note>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAnnotations(): Promise<Annotation[]> {
    const dbAnnotations = await db.select().from(annotations);
    return dbAnnotations.map(dbAnnotation => ({
      id: dbAnnotation.id,
      type: dbAnnotation.type as Annotation['type'],
      pageNumber: dbAnnotation.pageNumber,
      color: dbAnnotation.color as Annotation['color'] | undefined,
      content: dbAnnotation.content || undefined,
      position: dbAnnotation.position as Annotation['position'] | undefined,
      textSelection: dbAnnotation.textSelection as Annotation['textSelection'] | undefined,
      createdAt: dbAnnotation.createdAt,
    }));
  }

  async createAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation> {
    const result = await db.insert(annotations).values({
      type: annotation.type,
      pageNumber: annotation.pageNumber,
      color: annotation.color || null,
      content: annotation.content || null,
      position: annotation.position as any,
      textSelection: annotation.textSelection as any,
    }).returning();

    const dbAnnotation = result[0];
    return {
      id: dbAnnotation.id,
      type: dbAnnotation.type as Annotation['type'],
      pageNumber: dbAnnotation.pageNumber,
      color: dbAnnotation.color as Annotation['color'] | undefined,
      content: dbAnnotation.content || undefined,
      position: dbAnnotation.position as Annotation['position'] | undefined,
      textSelection: dbAnnotation.textSelection as Annotation['textSelection'] | undefined,
      createdAt: dbAnnotation.createdAt,
    };
  }

  async deleteAnnotation(id: string): Promise<boolean> {
    const result = await db.delete(annotations).where(eq(annotations.id, id)).returning();
    return result.length > 0;
  }

  async getBookmarks(): Promise<Bookmark[]> {
    const dbBookmarks = await db.select().from(bookmarks);
    return dbBookmarks.map(dbBookmark => ({
      id: dbBookmark.id,
      label: dbBookmark.label,
      pageNumber: dbBookmark.pageNumber,
      createdAt: dbBookmark.createdAt,
    }));
  }

  async createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
    const result = await db.insert(bookmarks).values({
      label: bookmark.label,
      pageNumber: bookmark.pageNumber,
    }).returning();

    const dbBookmark = result[0];
    return {
      id: dbBookmark.id,
      label: dbBookmark.label,
      pageNumber: dbBookmark.pageNumber,
      createdAt: dbBookmark.createdAt,
    };
  }

  async deleteBookmark(id: string): Promise<boolean> {
    const result = await db.delete(bookmarks).where(eq(bookmarks.id, id)).returning();
    return result.length > 0;
  }

  async getNotes(): Promise<Note[]> {
    const dbNotes = await db.select().from(notes);
    return dbNotes.map(dbNote => ({
      id: dbNote.id,
      content: dbNote.content,
      createdAt: dbNote.createdAt,
      updatedAt: dbNote.updatedAt,
    }));
  }

  async updateNote(id: string, content: string): Promise<Note> {
    // Try to update existing note
    const existing = await db.select().from(notes).where(eq(notes.id, id));
    
    if (existing.length > 0) {
      const result = await db.update(notes)
        .set({ 
          content, 
          updatedAt: new Date().toISOString() 
        })
        .where(eq(notes.id, id))
        .returning();
      
      const dbNote = result[0];
      return {
        id: dbNote.id,
        content: dbNote.content,
        createdAt: dbNote.createdAt,
        updatedAt: dbNote.updatedAt,
      };
    } else {
      // Create new note
      const result = await db.insert(notes).values({
        id,
        content,
      }).returning();
      
      const dbNote = result[0];
      return {
        id: dbNote.id,
        content: dbNote.content,
        createdAt: dbNote.createdAt,
        updatedAt: dbNote.updatedAt,
      };
    }
  }
}

export const storage = new DbStorage();
