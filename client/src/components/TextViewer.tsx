import { useEffect, useRef, useMemo, useState } from "react";
import type { Annotation, LearningFormat } from "@shared/schema";

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

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TextViewerProps {
  sections: Section[];
  currentPage: number;
  zoom: number;
  searchQuery?: string;
  currentSearchResult?: number;
  annotations?: Annotation[];
  mediaItems?: Map<number, { type: "image" | "audio" | "multimodal"; audioUrl?: string; imageUrl?: string }>;
  quiz?: Quiz;
  onPageChange: (page: number) => void;
  onSearchMatchesFound?: (matches: SearchMatch[]) => void;
  onMediaAdd?: (sectionId: number, type: "image" | "audio" | "multimodal") => void;
  onMediaRemove?: (sectionId: number) => void;
  aiRecommendation?: { sectionId: number; format: LearningFormat; reasoning: string; confidence: number };
  activeSectionId: number;
  onQuizSubmit?: (payload: { score: number; sectionId: number }) => void;
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
  quiz,
  onPageChange,
  onSearchMatchesFound,
  onMediaAdd,
  onMediaRemove,
  aiRecommendation,
  activeSectionId,
  onQuizSubmit,
}: TextViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const matchRefs = useRef<(HTMLElement | null)[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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

  const renderImageContent = (imageUrl?: string) => {
    if (imageUrl) {
      return (
        <div className="w-full bg-muted rounded-lg p-4 border-2">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-foreground">AI-Generated Image</p>
            <img
              src={imageUrl}
              alt="AI-generated representation of the content"
              className="w-full max-w-2xl rounded-lg"
              data-testid="generated-image"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-muted-foreground">Generating image...</p>
        </div>
      </div>
    );
  };

  const renderAudioContent = (audioUrl?: string) => {
    if (audioUrl) {
      return (
        <div className="w-full bg-muted rounded-lg p-6 border-2">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414c-.781-.781-.781-2.047 0-2.828l1.414-1.414a2 2 0 012.828 0l4.95 4.95a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0l-4.95-4.95z" />
            </svg>
            <p className="text-sm font-semibold text-foreground">Audio Narration</p>
            <audio
              controls
              src={audioUrl}
              className="w-full max-w-md"
              data-testid="audio-player"
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414c-.781-.781-.781-2.047 0-2.828l1.414-1.414a2 2 0 012.828 0l4.95 4.95a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0l-4.95-4.95z" />
          </svg>
          <p className="text-sm text-muted-foreground">Generating audio...</p>
        </div>
      </div>
    );
  };

  const renderMediaArea = (sectionId: number) => {
    const media = mediaItems?.get(sectionId);
    const isRecommended = aiRecommendation?.sectionId === sectionId;
    const recommendedFormat = aiRecommendation?.format;
    const recommendedFormatDisplay =
      recommendedFormat === "multimodal"
        ? "Image + Audio"
        : recommendedFormat
        ? `${recommendedFormat.charAt(0).toUpperCase()}${recommendedFormat.slice(1)}`
        : null;

    return (
      <div className="mt-6 border rounded-lg p-4 bg-muted/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Supplementary media</p>
            {isRecommended && aiRecommendation && (
              <p className="text-xs text-muted-foreground mt-1">
                <span role="img" aria-label="AI">🤖</span> AI found an alternative format to enhance this section.
              </p>
            )}
          </div>
          {isRecommended && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span role="img" aria-label="AI">🤖</span>
              AI-recommended format
            </span>
          )}
        </div>

        {media ? (
          <div className="flex flex-col items-center gap-4">
            {media.type === "image" && renderImageContent(media.imageUrl)}
            {media.type === "audio" && renderAudioContent(media.audioUrl)}
            {media.type === "multimodal" && (
              <div className="w-full flex flex-col gap-4">
                {renderImageContent(media.imageUrl)}
                {renderAudioContent(media.audioUrl)}
              </div>
            )}
            <button
              onClick={() => onMediaRemove?.(sectionId)}
              className="text-xs text-muted-foreground hover:text-foreground"
              data-testid="button-remove-media"
            >
              Remove media
            </button>
          </div>
        ) : (
          <div className="w-full bg-card rounded-lg border border-dashed p-6">
            <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
              {isRecommended && aiRecommendation && (
                <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl">
                      <span role="img" aria-label="AI">🤖</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        AI recommendation
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {recommendedFormatDisplay ? `${recommendedFormatDisplay} format suggested` : "Suggested format"}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {aiRecommendation.reasoning} ({Math.round(aiRecommendation.confidence * 100)}% confidence)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">
                {isRecommended && aiRecommendation
                  ? "Try the recommended format below or pick the one that suits you best."
                  : "Choose the media format that helps you understand this section."}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => onMediaAdd?.(sectionId, "image")}
                  className="flex-1 min-w-[120px] py-2 px-4 border rounded-md hover-elevate active-elevate-2 text-sm bg-card"
                  data-testid="button-add-image"
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Image
                </button>
                <button
                  onClick={() => onMediaAdd?.(sectionId, "audio")}
                  className="flex-1 min-w-[120px] py-2 px-4 border rounded-md hover-elevate active-elevate-2 text-sm bg-card"
                  data-testid="button-add-audio"
                >
                  <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414c-.781-.781-.781-2.047 0-2.828l1.414-1.414a2 2 0 012.828 0l4.95 4.95a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0l-4.95-4.95z" />
                  </svg>
                  Audio
                </button>
                {recommendedFormat === "multimodal" && (
                  <button
                    onClick={() => onMediaAdd?.(sectionId, "multimodal")}
                    className="flex-1 min-w-[140px] py-2 px-4 border rounded-md hover-elevate active-elevate-2 text-sm bg-card"
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" />
                    </svg>
                    Image + Audio
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
          <div key={section.id} className="mb-12">
            <div
              ref={(el) => (sectionRefs.current[index] = el)}
              className="mb-6"
              data-testid={`section-${section.id}`}
            >
              <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">
                {renderText(section.title, index)}
              </h2>
              <p className="font-serif text-base leading-relaxed text-foreground whitespace-pre-wrap">
                {renderText(section.content, index)}
              </p>
            </div>
            {renderMediaArea(section.id)}
          </div>
        ))}

        {/* Quiz section at the bottom */}
        {quiz && (
          <div className="mt-8 border rounded-lg p-6 bg-muted/50">
            <h3 className="font-serif text-xl font-semibold mb-4 text-foreground">Quiz</h3>
            <p className="font-serif text-base mb-6 text-foreground">{quiz.question}</p>
            
            <div className="space-y-3 mb-6">
              {quiz.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-4 border rounded-md cursor-pointer transition-colors ${
                    selectedAnswer === index
                      ? "bg-primary/10 border-primary"
                      : "hover-elevate"
                  } ${
                    quizSubmitted
                      ? index === quiz.correctAnswer
                        ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                        : selectedAnswer === index
                        ? "bg-red-100 dark:bg-red-900/30 border-red-500"
                        : ""
                      : ""
                  }`}
                  data-testid={`quiz-option-${index}`}
                >
                  <input
                    type="radio"
                    name="quiz-answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => !quizSubmitted && setSelectedAnswer(index)}
                    disabled={quizSubmitted}
                    className="w-4 h-4"
                  />
                  <span className="flex-1 text-sm">{option}</span>
                  {quizSubmitted && index === quiz.correctAnswer && (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {quizSubmitted && selectedAnswer === index && index !== quiz.correctAnswer && (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </label>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={() => {
                  if (selectedAnswer !== null) {
                    setQuizSubmitted(true);
                    const score = selectedAnswer === quiz.correctAnswer ? 1 : 0;
                    onQuizSubmit?.({ score, sectionId: activeSectionId });
                  }
                }}
                disabled={selectedAnswer === null}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit-quiz"
              >
                Submit Answer
              </button>
            ) : (
              <div className={`p-4 rounded-md ${
                selectedAnswer === quiz.correctAnswer
                  ? "bg-green-100 dark:bg-green-900/30 border border-green-500"
                  : "bg-red-100 dark:bg-red-900/30 border border-red-500"
              }`}>
                <p className={`font-semibold ${
                  selectedAnswer === quiz.correctAnswer
                    ? "text-green-800 dark:text-green-300"
                    : "text-red-800 dark:text-red-300"
                }`} data-testid="quiz-result">
                  {selectedAnswer === quiz.correctAnswer
                    ? "✓ Correct! Well done!"
                    : "✗ Incorrect. The correct answer is highlighted above."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
