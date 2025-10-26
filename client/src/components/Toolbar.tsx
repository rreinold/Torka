import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  Search,
  Highlighter,
  Moon,
  Sun,
  PanelRightClose,
  PanelRightOpen,
  User,
  Pen,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Link } from "wouter";

interface ToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  isSidebarOpen: boolean;
  selectedBook?: string;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onToggleSidebar: () => void;
  onSearchToggle: () => void;
  onAnnotateToggle: () => void;
  onBookChange?: (bookId: string) => void;
}

export function Toolbar({
  currentPage,
  totalPages,
  zoom,
  isSidebarOpen,
  selectedBook = "economics",
  onPageChange,
  onZoomChange,
  onToggleSidebar,
  onSearchToggle,
  onAnnotateToggle,
  onBookChange,
}: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4 gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold">Text Reader</h1>
        {onBookChange && (
          <Select value={selectedBook} onValueChange={onBookChange}>
            <SelectTrigger className="w-32 h-9" data-testid="select-book">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economics">Economics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          data-testid="button-first-page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          data-testid="button-prev-page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 px-2">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value) || 1)}
            className="w-16 h-9 text-center text-sm"
            data-testid="input-page-number"
          />
          <span className="text-sm text-muted-foreground">/ {totalPages}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          data-testid="button-next-page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          data-testid="button-last-page"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          disabled={zoom <= 25}
          data-testid="button-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Select
          value={zoom.toString()}
          onValueChange={(value) => onZoomChange(parseInt(value))}
        >
          <SelectTrigger className="w-24 h-9" data-testid="select-zoom">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25%</SelectItem>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
            <SelectItem value="125">125%</SelectItem>
            <SelectItem value="150">150%</SelectItem>
            <SelectItem value="200">200%</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onZoomChange(Math.min(500, zoom + 25))}
          disabled={zoom >= 500}
          data-testid="button-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="default"
          onClick={onSearchToggle}
          data-testid="button-search"
        >
          <Search className="w-4 h-4" />
          Search
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={onAnnotateToggle}
          data-testid="button-annotate"
        >
          <Highlighter className="w-4 h-4" />
          Annotate
        </Button>
        <Link href="/profile">
          <Button
            variant="ghost"
            size="default"
            data-testid="button-profile"
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleSidebar}
          data-testid="button-toggle-sidebar"
        >
          {isSidebarOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
