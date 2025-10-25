import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onClose: () => void;
}

export function SearchPanel({ onSearch, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [currentResult, setCurrentResult] = useState(0);
  const totalResults = 0;

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

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
            className="pl-9 pr-20"
            data-testid="input-search"
          />
          {query && (
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {totalResults} results
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            disabled={!query || totalResults === 0}
            data-testid="button-search-prev"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={!query || totalResults === 0}
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
