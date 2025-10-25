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
  mediaItems?: Map<number, { type: "image" | "video" }>;
  onPageChange: (page: number) => void;
  onSearchMatchesFound?: (matches: SearchMatch[]) => void;
  onMediaAdd?: (sectionId: number, type: "image" | "video") => void;
  onMediaRemove?: (sectionId: number) => void;
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
  mediaItems,
  onPageChange,
  onSearchMatchesFound,
  onMediaAdd,
  onMediaRemove,
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

  const renderText = (text: string, sectionIndex: number) => {
    const sectionAnnotations = annotations.filter((a) => a.pageNumber === sectionIndex + 1);
    const sectionMatches = searchMatches.filter((m) => m.sectionIndex === sectionIndex);

    // Build all spans (annotations + search results)
    const spans: TextSpan[] = [];

    // Add annotation spans using stored offsets
    sectionAnnotations.forEach((annotation) => {
      if (!annotation.textSelection) return;
      
      const { start, end } = annotation.textSelection;
      spans.push({
        start,
        end,
        type: "annotation",
        annotation,
      });
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

    // Sort spans by start position, then by end (shorter first for proper nesting)
    spans.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return (a.end - a.start) - (b.end - b.start);
    });

    // Split overlapping spans
    const splitSpans: Array<{ start: number; end: number; types: TextSpan[] }> = [];
    const breakpoints = new Set<number>();
    
    spans.forEach((span) => {
      breakpoints.add(span.start);
      breakpoints.add(span.end);
    });

    const sortedBreakpoints = Array.from(breakpoints).sort((a, b) => a - b);

    for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
      const start = sortedBreakpoints[i];
      const end = sortedBreakpoints[i + 1];
      
      const activeSpans = spans.filter(
        (span) => span.start <= start && span.end >= end
      );

      if (activeSpans.length > 0) {
        splitSpans.push({ start, end, types: activeSpans });
      }
    }

    // Render text with split spans
    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    splitSpans.forEach((segment, segmentIdx) => {
      // Add text before this segment
      if (segment.start > lastIndex) {
        result.push(text.substring(lastIndex, segment.start));
      }

      const segmentText = text.substring(segment.start, segment.end);
      const key = `segment-${segmentIdx}-${segment.start}`;

      // Determine which styles to apply (priority: search-active > annotation > search)
      const hasSearchActive = segment.types.some((s) => s.type === "search-active");
      const hasAnnotation = segment.types.find((s) => s.type === "annotation");
      const hasSearch = segment.types.some((s) => s.type === "search");
      const searchSpan = segment.types.find((s) => s.type === "search" || s.type === "search-active");

      let className = "";
      let title = "";

      if (hasAnnotation) {
        const annotation = hasAnnotation.annotation!;
        className = "rounded px-0.5 ";

        if (annotation.type === "highlight") {
          className += getColorClass(annotation.color);
        } else if (annotation.type === "underline") {
          className += "underline decoration-2";
        } else if (annotation.type === "strikethrough") {
          className += "line-through";
        }

        title = annotation.content || annotation.type;
      }

      if (hasSearchActive) {
        className += " ring-2 ring-offset-1 ring-orange-500 bg-orange-400 dark:bg-orange-600";
      } else if (hasSearch && !hasAnnotation) {
        className += " bg-yellow-300 dark:bg-yellow-600";
      }

      const refProps = searchSpan?.matchIndex !== undefined
        ? { ref: (el: HTMLElement | null) => (matchRefs.current[searchSpan.matchIndex!] = el) }
        : {};

      result.push(
        <span
          key={key}
          className={className || undefined}
          title={title || undefined}
          {...refProps}
        >
          {segmentText}
        </span>
      );

      lastIndex = segment.end;
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
        className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8 md:p-12 lg:p-16 pb-96 transition-transform duration-200"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
      >
        {sections.map((section, index) => (
          <div key={section.id}>
            <div
              ref={(el) => (sectionRefs.current[index] = el)}
              className="mb-12"
              data-testid={`section-${section.id}`}
            >
              <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
                {renderText(section.title, index)}
              </h2>
              <p className="font-serif text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {renderText(section.content, index)}
              </p>
            </div>
          </div>
        ))}

        {/* Single Media section at the bottom */}
        <div className="mt-8 border rounded-lg p-4 bg-muted/50">
          {mediaItems?.has(0) ? (
            <div className="flex flex-col items-center gap-4">
              {mediaItems.get(0)?.type === "image" ? (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Image Placeholder</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">Video Placeholder</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => onMediaRemove?.(0)}
                className="text-xs text-muted-foreground hover:text-foreground"
                data-testid="button-remove-media"
              >
                Remove media
              </button>
            </div>
          ) : (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
              <div className="flex flex-col gap-4 w-full max-w-md px-4">
                <p className="text-sm text-muted-foreground text-center">Choose your preferred media type for explanation</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onMediaAdd?.(0, "image")}
                    className="flex-1 py-2 px-4 border rounded-md hover-elevate active-elevate-2 text-sm bg-card"
                    data-testid="button-add-image"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image
                  </button>
                  <button
                    onClick={() => onMediaAdd?.(0, "video")}
                    className="flex-1 py-2 px-4 border rounded-md hover-elevate active-elevate-2 text-sm bg-card"
                    data-testid="button-add-video"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Video
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
