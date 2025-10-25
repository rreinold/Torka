import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Toolbar } from "@/components/Toolbar";
import { TextViewer } from "@/components/TextViewer";
import { Sidebar } from "@/components/Sidebar";
import { SearchPanel } from "@/components/SearchPanel";
import { AnnotationToolbar } from "@/components/AnnotationToolbar";
import { sampleDocument } from "@/lib/sampleText";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import * as api from "@/lib/api";
import type { Annotation, Bookmark, Note, AnnotationType, HighlightColor } from "@shared/schema";

interface SearchMatch {
  sectionIndex: number;
  matchIndex: number;
  position: number;
  length: number;
}

export default function Reader() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnotateMode, setIsAnnotateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchResult, setCurrentSearchResult] = useState(0);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);
  const [activeColor, setActiveColor] = useState<HighlightColor>("yellow");
  const [mediaItems, setMediaItems] = useState<Map<number, { type: "image" | "video" }>>(new Map());

  const totalPages = sampleDocument.sections.length;
  const totalSearchResults = searchMatches.length;

  // Fetch data
  const { data: annotations = [] } = useQuery<Annotation[]>({
    queryKey: ["/api/annotations"],
  });

  const { data: bookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ["/api/bookmarks"],
  });

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  // Mutations
  const createAnnotationMutation = useMutation({
    mutationFn: api.createAnnotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/annotations"] });
      toast({
        title: "Annotation created",
        description: "Your annotation has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create annotation.",
        variant: "destructive",
      });
    },
  });

  const deleteAnnotationMutation = useMutation({
    mutationFn: api.deleteAnnotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/annotations"] });
      toast({
        title: "Annotation deleted",
        description: "Your annotation has been removed.",
      });
    },
  });

  const createBookmarkMutation = useMutation({
    mutationFn: api.createBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark created",
        description: "Your bookmark has been saved.",
      });
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: api.deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark deleted",
        description: "Your bookmark has been removed.",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      api.updateNote(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(500, newZoom)));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !activeTool) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // Simple annotation without precise offset tracking
    // The text itself is enough for matching in most cases
    if (activeTool === "highlight" || activeTool === "underline" || activeTool === "strikethrough") {
      createAnnotationMutation.mutate({
        type: activeTool,
        pageNumber: currentPage,
        color: activeColor,
        textSelection: {
          start: 0,
          end: selectedText.length,
          text: selectedText,
        },
      });
    } else if (activeTool === "note") {
      const noteContent = prompt("Enter your note:");
      if (noteContent) {
        createAnnotationMutation.mutate({
          type: "note",
          pageNumber: currentPage,
          content: noteContent,
          textSelection: {
            start: 0,
            end: selectedText.length,
            text: selectedText,
          },
        });
      }
    }

    selection.removeAllRanges();
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setCurrentPage(annotation.pageNumber);
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    setCurrentPage(bookmark.pageNumber);
  };

  const handleAnnotationDelete = (id: string) => {
    deleteAnnotationMutation.mutate(id);
  };

  const handleBookmarkDelete = (id: string) => {
    deleteBookmarkMutation.mutate(id);
  };

  const handleBookmarkAdd = (label: string, pageNumber: number) => {
    createBookmarkMutation.mutate({ label, pageNumber });
  };

  const handleNoteUpdate = (content: string) => {
    const noteId = notes[0]?.id || "default";
    updateNoteMutation.mutate({ id: noteId, content });
  };

  const handleNextSearchResult = () => {
    if (totalSearchResults > 0) {
      setCurrentSearchResult((prev) => (prev + 1) % totalSearchResults);
    }
  };

  const handlePrevSearchResult = () => {
    if (totalSearchResults > 0) {
      setCurrentSearchResult((prev) => (prev - 1 + totalSearchResults) % totalSearchResults);
    }
  };

  const handleSearchMatchesFound = (matches: SearchMatch[]) => {
    setSearchMatches(matches);
    setCurrentSearchResult(0);
  };

  const handleMediaAdd = (sectionId: number, type: "image" | "video") => {
    const newMap = new Map(mediaItems);
    newMap.set(sectionId, { type });
    setMediaItems(newMap);
    toast({
      title: `${type === "image" ? "Image" : "Video"} added`,
      description: `A ${type} placeholder has been added to the section.`,
    });
  };

  const handleMediaRemove = (sectionId: number) => {
    const newMap = new Map(mediaItems);
    newMap.delete(sectionId);
    setMediaItems(newMap);
    toast({
      title: "Media removed",
      description: "The multimedia placeholder has been removed.",
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        handlePageChange(1);
      } else if (e.key === "End") {
        e.preventDefault();
        handlePageChange(totalPages);
      } else if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setActiveTool(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (activeTool) {
      const handleMouseUp = () => {
        setTimeout(handleTextSelection, 10);
      };
      document.addEventListener("mouseup", handleMouseUp);
      return () => document.removeEventListener("mouseup", handleMouseUp);
    }
  }, [activeTool, activeColor, currentPage]);

  return (
    <div className="h-screen flex flex-col" data-testid="reader-page">
      <Toolbar
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        isSidebarOpen={isSidebarOpen}
        onPageChange={handlePageChange}
        onZoomChange={handleZoomChange}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
        onAnnotateToggle={() => setIsAnnotateMode(!isAnnotateMode)}
      />

      {isSearchOpen && (
        <SearchPanel
          onSearch={setSearchQuery}
          onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
          }}
          totalResults={totalSearchResults}
          currentResult={currentSearchResult}
          onNextResult={handleNextSearchResult}
          onPrevResult={handlePrevSearchResult}
        />
      )}

      {isAnnotateMode && (
        <AnnotationToolbar
          activeTool={activeTool}
          activeColor={activeColor}
          onToolChange={setActiveTool}
          onColorChange={setActiveColor}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        <TextViewer
          sections={sampleDocument.sections}
          currentPage={currentPage}
          zoom={zoom}
          searchQuery={searchQuery}
          currentSearchResult={currentSearchResult}
          annotations={annotations}
          mediaItems={mediaItems}
          onPageChange={handlePageChange}
          onSearchMatchesFound={handleSearchMatchesFound}
          onMediaAdd={handleMediaAdd}
          onMediaRemove={handleMediaRemove}
        />

        {isSidebarOpen && (
          <Sidebar
            annotations={annotations}
            bookmarks={bookmarks}
            notes={notes}
            onAnnotationClick={handleAnnotationClick}
            onBookmarkClick={handleBookmarkClick}
            onAnnotationDelete={handleAnnotationDelete}
            onBookmarkDelete={handleBookmarkDelete}
            onBookmarkAdd={handleBookmarkAdd}
            onNoteUpdate={handleNoteUpdate}
          />
        )}
      </div>
    </div>
  );
}
