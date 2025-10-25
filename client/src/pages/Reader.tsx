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
  length: number;
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

interface TextSpan {
  start: number;
  end: number;
  type: "annotation" | "search" | "search-active";
  annotation?: Annotation;
  matchIndex?: number;
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
          length: match[0].length,
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
      if (currentPage !== match.sectionIndex + 1) {
        onPageChange(match.sectionIndex + 1);
      }
      setTimeout(() => {
        matchRefs.current[currentSearchResult]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [currentSearchResult, searchMatches]);

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

  const renderText = (text: string, sectionIndex: number, isTitle: boolean = false) => {
    const sectionAnnotations = annotations.filter((a) => a.pageNumber === sectionIndex + 1);
    const sectionMatches = searchMatches.filter((m) => m.sectionIndex === sectionIndex);

    // Build all spans (annotations + search results)
    const spans: TextSpan[] = [];

    // Add annotation spans
    sectionAnnotations.forEach((annotation) => {
      if (!annotation.textSelection) return;
      
      const { text: annotatedText, start, end } = annotation.textSelection;
      let actualStart = text.indexOf(annotatedText);
      
      if (actualStart !== -1) {
        spans.push({
          start: actualStart,
          end: actualStart + annotatedText.length,
          type: "annotation",
          annotation,
        });
      }
    });

    // Add search match spans
    let globalMatchOffset = searchMatches.findIndex((m) => m.sectionIndex === sectionIndex);
    sectionMatches.forEach((match, idx) => {
      const isActive = globalMatchOffset + idx === currentSearchResult;
      spans.push({
        start: match.position,
        end: match.position + match.length,
        type: isActive ? "search-active" : "search",
        matchIndex: globalMatchOffset + idx,
      });
    });

    // Sort spans by start position
    spans.sort((a, b) => a.start - b.start);

    // Render text with spans
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    spans.forEach((span, spanIdx) => {
      // Add text before this span
      if (span.start > lastIndex) {
        result.push(text.substring(lastIndex, span.start));
      }

      const spanText = text.substring(span.start, span.end);
      const key = `span-${spanIdx}-${span.start}`;

      if (span.type === "annotation" && span.annotation) {
        const annotation = span.annotation;
        let className = "rounded px-0.5";

        if (annotation.type === "highlight") {
          className += ` ${getColorClass(annotation.color)}`;
        } else if (annotation.type === "underline") {
          className += " underline decoration-2";
        } else if (annotation.type === "strikethrough") {
          className += " line-through";
        }

        // Check if this annotation overlaps with current search result
        const hasActiveSearch = spans.some(
          (s) =>
            s.type === "search-active" &&
            s.start < span.end &&
            s.end > span.start
        );

        if (hasActiveSearch) {
          className += " ring-2 ring-orange-500";
        }

        result.push(
          <span
            key={key}
            className={className}
            title={annotation.content || annotation.type}
          >
            {spanText}
          </span>
        );
      } else if (span.type === "search" || span.type === "search-active") {
        const isActive = span.type === "search-active";
        result.push(
          <mark
            key={key}
            ref={
              span.matchIndex !== undefined
                ? (el) => (matchRefs.current[span.matchIndex!] = el)
                : undefined
            }
            className={`rounded px-0.5 ${
              isActive
                ? "bg-orange-400 dark:bg-orange-600"
                : "bg-yellow-300 dark:bg-yellow-600"
            }`}
          >
            {spanText}
          </mark>
        );
      }

      lastIndex = Math.max(lastIndex, span.end);
    });

    // Add remaining text
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
              {renderText(section.title, index, true)}
            </h2>
            <p className="font-serif text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {renderText(section.content, index)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
