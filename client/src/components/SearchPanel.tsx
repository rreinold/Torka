import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onClose: () => void;
  totalResults?: number;
  currentResult?: number;
  onNextResult?: () => void;
  onPrevResult?: () => void;
}

export function SearchPanel({
  onSearch,
  onClose,
  totalResults = 0,
  currentResult = 0,
  onNextResult,
  onPrevResult,
}: SearchPanelProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && query) {
        e.preventDefault();
        if (e.shiftKey) {
          onPrevResult?.();
        } else {
          onNextResult?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query, onNextResult, onPrevResult]);

  return (
    <div className="border-b bg-card p-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search in document..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-24"
            autoFocus
            data-testid="input-search"
          />
          {query && (
            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap">
              {totalResults > 0 ? `${currentResult + 1} / ${totalResults}` : "No results"}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            disabled={!query || totalResults === 0}
            onClick={onPrevResult}
            data-testid="button-search-prev"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={!query || totalResults === 0}
            onClick={onNextResult}
            data-testid="button-search-next"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-search-close"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
