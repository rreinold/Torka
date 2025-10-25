import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Highlighter, BookOpen, StickyNote, Bookmark, List, Trash2 } from "lucide-react";
import type { Annotation, Bookmark as BookmarkType, Note } from "@shared/schema";

interface SidebarProps {
  annotations: Annotation[];
  bookmarks: BookmarkType[];
  notes: Note[];
  onAnnotationClick: (annotation: Annotation) => void;
  onBookmarkClick: (bookmark: BookmarkType) => void;
  onAnnotationDelete: (id: string) => void;
  onBookmarkDelete: (id: string) => void;
  onBookmarkAdd: (label: string, pageNumber: number) => void;
  onNoteUpdate: (content: string) => void;
}

export function Sidebar({
  annotations,
  bookmarks,
  notes,
  onAnnotationClick,
  onBookmarkClick,
  onAnnotationDelete,
  onBookmarkDelete,
  onBookmarkAdd,
  onNoteUpdate,
}: SidebarProps) {
  return (
    <div className="w-80 border-l bg-background flex flex-col" data-testid="sidebar">
      <Tabs defaultValue="annotations" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-12 px-4">
          <TabsTrigger value="annotations" className="gap-2" data-testid="tab-annotations">
            <Highlighter className="w-4 h-4" />
            Annotations
            {annotations.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {annotations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="gap-2" data-testid="tab-bookmarks">
            <Bookmark className="w-4 h-4" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2" data-testid="tab-notes">
            <StickyNote className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="outline" className="gap-2" data-testid="tab-outline">
            <List className="w-4 h-4" />
            Outline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="annotations" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {annotations.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No annotations yet. Start by selecting text and using the annotation tools.
                </div>
              ) : (
                annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="group rounded-md p-3 border hover-elevate cursor-pointer"
                    onClick={() => onAnnotationClick(annotation)}
                    data-testid={`annotation-${annotation.id}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {annotation.type}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnnotationDelete(annotation.id);
                        }}
                        data-testid={`button-delete-annotation-${annotation.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    {annotation.textSelection && (
                      <p className="text-sm italic line-clamp-2 mb-2">
                        "{annotation.textSelection.text}"
                      </p>
                    )}
                    {annotation.content && (
                      <p className="text-sm text-muted-foreground">{annotation.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        Page {annotation.pageNumber}
                      </span>
                      {annotation.color && (
                        <div
                          className={`w-4 h-4 rounded-sm bg-${annotation.color}-300`}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bookmarks" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No bookmarks yet. Create bookmarks to quickly navigate to important sections.
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="group flex items-center justify-between rounded-md p-3 border hover-elevate cursor-pointer"
                    onClick={() => onBookmarkClick(bookmark)}
                    data-testid={`bookmark-${bookmark.id}`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{bookmark.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Page {bookmark.pageNumber}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkDelete(bookmark.id);
                      }}
                      data-testid={`button-delete-bookmark-${bookmark.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0 flex flex-col">
          <div className="flex-1 p-4">
            <Textarea
              placeholder="Write your notes here..."
              className="h-full resize-none"
              value={notes[0]?.content || ""}
              onChange={(e) => onNoteUpdate(e.target.value)}
              data-testid="textarea-notes"
            />
          </div>
        </TabsContent>

        <TabsContent value="outline" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <div
                className="rounded-md p-3 hover-elevate cursor-pointer"
                data-testid="outline-section-1"
              >
                <p className="text-sm font-medium">1. Understanding Torque</p>
              </div>
              <div
                className="rounded-md p-3 hover-elevate cursor-pointer"
                data-testid="outline-section-2"
              >
                <p className="text-sm font-medium">2. Applications and Examples</p>
              </div>
              <div
                className="rounded-md p-3 hover-elevate cursor-pointer"
                data-testid="outline-section-3"
              >
                <p className="text-sm font-medium">3. Measuring and Controlling Torque</p>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
