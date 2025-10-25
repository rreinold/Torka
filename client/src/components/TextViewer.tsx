import { useEffect, useRef } from "react";

interface Section {
  id: number;
  title: string;
  content: string;
}

interface TextViewerProps {
  sections: Section[];
  currentPage: number;
  zoom: number;
  searchQuery?: string;
  onPageChange: (page: number) => void;
}

export function TextViewer({
  sections,
  currentPage,
  zoom,
  searchQuery,
  onPageChange,
}: TextViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (sectionRefs.current[currentPage - 1]) {
      sectionRefs.current[currentPage - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5"
          data-testid={`highlight-search-${index}`}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-muted/30 p-8"
      style={{ scrollPaddingTop: "80px" }}
      data-testid="text-viewer"
    >
      <div
        className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8 md:p-12 lg:p-16"
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
              {highlightText(section.title, searchQuery)}
            </h2>
            <p className="font-serif text-base leading-relaxed text-foreground whitespace-pre-wrap">
              {highlightText(section.content, searchQuery)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
