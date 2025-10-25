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
      <Tabs defaultValue="notes" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b h-12 px-4">
          <TabsTrigger value="notes" className="gap-2" data-testid="tab-notes">
            <StickyNote className="w-4 h-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="outline" className="gap-2" data-testid="tab-outline">
            <List className="w-4 h-4" />
            Outline
          </TabsTrigger>
        </TabsList>

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
