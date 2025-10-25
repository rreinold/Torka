import { useState, useEffect } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TextViewer } from "@/components/TextViewer";
import { Sidebar } from "@/components/Sidebar";
import { SearchPanel } from "@/components/SearchPanel";
import { AnnotationToolbar } from "@/components/AnnotationToolbar";
import { sampleDocument } from "@/lib/sampleText";
import type { Annotation, Bookmark, Note, AnnotationType, HighlightColor } from "@shared/schema";

export default function Reader() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAnnotateMode, setIsAnnotateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);
  const [activeColor, setActiveColor] = useState<HighlightColor>("yellow");

  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const totalPages = sampleDocument.sections.length;

  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(25, Math.min(500, newZoom)));
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    console.log("Navigate to annotation:", annotation);
    setCurrentPage(annotation.pageNumber);
  };

  const handleBookmarkClick = (bookmark: Bookmark) => {
    console.log("Navigate to bookmark:", bookmark);
    setCurrentPage(bookmark.pageNumber);
  };

  const handleAnnotationDelete = (id: string) => {
    console.log("Delete annotation:", id);
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleBookmarkDelete = (id: string) => {
    console.log("Delete bookmark:", id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleBookmarkAdd = (label: string, pageNumber: number) => {
    console.log("Add bookmark:", label, pageNumber);
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      label,
      pageNumber,
      createdAt: new Date().toISOString(),
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  const handleNoteUpdate = (content: string) => {
    console.log("Update note:", content);
    setNotes([
      {
        ...notes[0],
        content,
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

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
          onPageChange={handlePageChange}
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
