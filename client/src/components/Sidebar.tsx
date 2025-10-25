import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Highlighter, BookOpen, StickyNote, Bookmark, List, Trash2, Plus } from "lucide-react";
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
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddBookmark = () => {
    if (bookmarkLabel.trim()) {
      onBookmarkAdd(bookmarkLabel, bookmarkPage);
      setBookmarkLabel("");
      setBookmarkPage(1);
      setIsDialogOpen(false);
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-300";
      case "green":
        return "bg-green-300";
      case "blue":
        return "bg-blue-300";
      case "pink":
        return "bg-pink-300";
      case "orange":
        return "bg-orange-300";
      default:
        return "bg-gray-300";
    }
  };

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
                  No annotations yet. Start by enabling annotation mode and selecting text.
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
                          className={`w-4 h-4 rounded-sm ${getColorClass(annotation.color)}`}
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
          <div className="p-4 border-b">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" data-testid="button-add-bookmark">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bookmark
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Bookmark</DialogTitle>
                  <DialogDescription>
                    Add a bookmark to quickly navigate to important sections.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bookmark-label">Label</Label>
                    <Input
                      id="bookmark-label"
                      placeholder="e.g., Important concept"
                      value={bookmarkLabel}
                      onChange={(e) => setBookmarkLabel(e.target.value)}
                      data-testid="input-bookmark-label"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookmark-page">Page Number</Label>
                    <Input
                      id="bookmark-page"
                      type="number"
                      min={1}
                      value={bookmarkPage}
                      onChange={(e) => setBookmarkPage(parseInt(e.target.value) || 1)}
                      data-testid="input-bookmark-page"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddBookmark}
                    data-testid="button-save-bookmark"
                  >
                    Save Bookmark
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                onClick={() => onAnnotationClick({ pageNumber: 1 } as Annotation)}
              >
                <p className="text-sm font-medium">1. Understanding Torque</p>
              </div>
              <div
                className="rounded-md p-3 hover-elevate cursor-pointer"
                data-testid="outline-section-2"
                onClick={() => onAnnotationClick({ pageNumber: 2 } as Annotation)}
              >
                <p className="text-sm font-medium">2. Applications and Examples</p>
              </div>
              <div
                className="rounded-md p-3 hover-elevate cursor-pointer"
                data-testid="outline-section-3"
                onClick={() => onAnnotationClick({ pageNumber: 3 } as Annotation)}
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
