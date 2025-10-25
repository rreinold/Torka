import { type User, type InsertUser, type Annotation, type Bookmark, type Note, type StudentInteraction } from "@shared/schema";
import { randomUUID } from "crypto";

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

  // Student interactions
  recordInteraction(interaction: Omit<StudentInteraction, 'id' | 'interactedAt'> & Partial<Pick<StudentInteraction, 'interactedAt'>>): Promise<StudentInteraction>;
  getInteractions(): Promise<StudentInteraction[]>;
  getInteractionsBySection(sectionId: string | number): Promise<StudentInteraction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private annotations: Map<string, Annotation>;
  private bookmarks: Map<string, Bookmark>;
  private notes: Map<string, Note>;
  private interactions: Map<string, StudentInteraction>;

  constructor() {
    this.users = new Map();
    this.annotations = new Map();
    this.bookmarks = new Map();
    this.notes = new Map();
    this.interactions = new Map();
    
    // Initialize with default note
    const defaultNote: Note = {
      id: "default",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(defaultNote.id, defaultNote);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAnnotations(): Promise<Annotation[]> {
    return Array.from(this.annotations.values());
  }

  async createAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation> {
    const newAnnotation: Annotation = {
      ...annotation,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.annotations.set(newAnnotation.id, newAnnotation);
    return newAnnotation;
  }

  async deleteAnnotation(id: string): Promise<boolean> {
    return this.annotations.delete(id);
  }

  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values());
  }

  async createBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.bookmarks.set(newBookmark.id, newBookmark);
    return newBookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async updateNote(id: string, content: string): Promise<Note> {
    const note = this.notes.get(id);
    if (!note) {
      const newNote: Note = {
        id,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.notes.set(id, newNote);
      return newNote;
    }
    
    const updatedNote: Note = {
      ...note,
      content,
      updatedAt: new Date().toISOString(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async recordInteraction(interaction: Omit<StudentInteraction, 'id' | 'interactedAt'> & Partial<Pick<StudentInteraction, 'interactedAt'>>): Promise<StudentInteraction> {
    const id = randomUUID();
    const stored: StudentInteraction = {
      ...interaction,
      id,
      interactedAt: interaction.interactedAt ?? new Date().toISOString(),
    };
    this.interactions.set(id, stored);
    return stored;
  }

  async getInteractions(): Promise<StudentInteraction[]> {
    return Array.from(this.interactions.values()).sort((a, b) => a.interactedAt.localeCompare(b.interactedAt));
  }

  async getInteractionsBySection(sectionId: string | number): Promise<StudentInteraction[]> {
    return (await this.getInteractions()).filter((interaction) => interaction.sectionId === sectionId);
  }
}

export const storage = new MemStorage();
