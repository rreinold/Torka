import { useEffect, useRef, useMemo } from "react";
import type { Annotation } from "@shared/schema";

interface Section {
  id: number;
  title: string;
  content: string;
}

interface SearchMatch {
  sectionIndex: number;
  matchIndex: number;
  position: number;
}

interface TextViewerProps {
  sections: Section[];
  currentPage: number;
  zoom: number;
  searchQuery?: string;
  currentSearchResult?: number;
  annotations?: Annotation[];
  onPageChange: (page: number) => void;
  onSearchMatchesFound?: (matches: SearchMatch[]) => void;
}

export function TextViewer({
  sections,
  currentPage,
  zoom,
  searchQuery,
  currentSearchResult = 0,
  annotations = [],
  onPageChange,
  onSearchMatchesFound,
}: TextViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const matchRefs = useRef<(HTMLElement | null)[]>([]);

  // Build search match index
  const searchMatches = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return [];
    }

    const matches: SearchMatch[] = [];
    sections.forEach((section, sectionIndex) => {
      const text = section.title + " " + section.content;
      const regex = new RegExp(searchQuery, "gi");
      let match;
      let matchIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          sectionIndex,
          matchIndex,
          position: match.index,
        });
        matchIndex++;
      }
    });

    return matches;
  }, [sections, searchQuery]);

  useEffect(() => {
    onSearchMatchesFound?.(searchMatches);
  }, [searchMatches, onSearchMatchesFound]);

  // Scroll to current page
  useEffect(() => {
    if (sectionRefs.current[currentPage - 1]) {
      sectionRefs.current[currentPage - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // Scroll to current search result
  useEffect(() => {
    if (searchMatches.length > 0 && matchRefs.current[currentSearchResult]) {
      const match = searchMatches[currentSearchResult];
      onPageChange(match.sectionIndex + 1);
      setTimeout(() => {
        matchRefs.current[currentSearchResult]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  }, [currentSearchResult, searchMatches, onPageChange]);

  const getAnnotationsForSection = (sectionId: number) => {
    return annotations.filter((a) => a.pageNumber === sectionId);
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-300 dark:bg-yellow-600/60";
      case "green":
        return "bg-green-300 dark:bg-green-600/60";
      case "blue":
        return "bg-blue-300 dark:bg-blue-600/60";
      case "pink":
        return "bg-pink-300 dark:bg-pink-600/60";
      case "orange":
        return "bg-orange-300 dark:bg-orange-600/60";
      default:
        return "bg-yellow-300 dark:bg-yellow-600/60";
    }
  };

  const highlightText = (text: string, sectionIndex: number) => {
    if (!searchQuery || !searchQuery.trim()) {
      return renderWithAnnotations(text, sectionIndex);
    }

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    let globalMatchIndex = searchMatches.findIndex((m) => m.sectionIndex === sectionIndex);
    let localMatchIndex = 0;

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchQuery.toLowerCase()) {
        const isCurrentResult = globalMatchIndex + localMatchIndex === currentSearchResult;
        const matchIndex = globalMatchIndex + localMatchIndex;
        localMatchIndex++;

        return (
          <mark
            key={index}
            ref={(el) => (matchRefs.current[matchIndex] = el)}
            className={`rounded px-0.5 ${
              isCurrentResult
                ? "bg-orange-400 dark:bg-orange-600"
                : "bg-yellow-300 dark:bg-yellow-600"
            }`}
            data-testid={`highlight-search-${index}`}
          >
            {part}
          </mark>
        );
      }
      return <span key={index}>{renderWithAnnotations(part, sectionIndex)}</span>;
    });
  };

  const renderWithAnnotations = (text: string, sectionIndex: number) => {
    const sectionAnnotations = getAnnotationsForSection(sectionIndex + 1);
    
    if (sectionAnnotations.length === 0) {
      return text;
    }

    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    sectionAnnotations.forEach((annotation, idx) => {
      if (!annotation.textSelection) return;

      const { text: annotatedText } = annotation.textSelection;
      const startPos = text.indexOf(annotatedText, lastIndex);

      if (startPos === -1) return;

      if (startPos > lastIndex) {
        result.push(text.substring(lastIndex, startPos));
      }

      const className = annotation.type === "highlight" 
        ? getColorClass(annotation.color)
        : annotation.type === "underline"
        ? "underline decoration-2"
        : annotation.type === "strikethrough"
        ? "line-through"
        : "";

      result.push(
        <span
          key={`annotation-${idx}`}
          className={`${className} rounded px-0.5`}
          title={annotation.content || annotation.type}
        >
          {annotatedText}
        </span>
      );

      lastIndex = startPos + annotatedText.length;
    });

    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }

    return result.length > 0 ? result : text;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-muted/30 p-8"
      style={{ scrollPaddingTop: "80px" }}
      data-testid="text-viewer"
    >
      <div
        className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8 md:p-12 lg:p-16 transition-transform duration-200"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
      >
        {sections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="mb-12"
            data-testid={`section-${section.id}`}
          >
            <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
              {highlightText(section.title, index)}
            </h2>
            <p className="font-serif text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {highlightText(section.content, index)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
