import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Highlighter, Underline, Strikethrough, StickyNote, Pen, Square, Circle, MoveRight } from "lucide-react";
import type { AnnotationType, HighlightColor } from "@shared/schema";

interface AnnotationToolbarProps {
  activeTool: AnnotationType | null;
  activeColor: HighlightColor;
  onToolChange: (tool: AnnotationType | null) => void;
  onColorChange: (color: HighlightColor) => void;
}

const colorOptions: { value: HighlightColor; label: string; className: string }[] = [
  { value: "yellow", label: "Yellow", className: "bg-yellow-300" },
  { value: "green", label: "Green", className: "bg-green-300" },
  { value: "blue", label: "Blue", className: "bg-blue-300" },
  { value: "pink", label: "Pink", className: "bg-pink-300" },
  { value: "orange", label: "Orange", className: "bg-orange-300" },
];

export function AnnotationToolbar({
  activeTool,
  activeColor,
  onToolChange,
  onColorChange,
}: AnnotationToolbarProps) {
  return (
    <div className="border-b bg-card p-3 flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          size="icon"
          variant={activeTool === "highlight" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "highlight" ? null : "highlight")}
          data-testid="button-tool-highlight"
        >
          <Highlighter className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === "underline" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "underline" ? null : "underline")}
          data-testid="button-tool-underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === "strikethrough" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "strikethrough" ? null : "strikethrough")}
          data-testid="button-tool-strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === "note" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "note" ? null : "note")}
          data-testid="button-tool-note"
        >
          <StickyNote className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      <div className="flex items-center gap-1 border rounded-lg p-1">
        <Button
          size="icon"
          variant={activeTool === "drawing" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "drawing" ? null : "drawing")}
          data-testid="button-tool-drawing"
        >
          <Pen className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant={activeTool === "shape" ? "secondary" : "ghost"}
          onClick={() => onToolChange(activeTool === "shape" ? null : "shape")}
          data-testid="button-tool-shape"
        >
          <Square className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Color:</span>
        <div className="flex gap-1">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-md border-2 ${color.className} ${
                activeColor === color.value
                  ? "ring-2 ring-offset-2 ring-primary"
                  : "hover-elevate"
              }`}
              onClick={() => onColorChange(color.value)}
              data-testid={`button-color-${color.value}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
