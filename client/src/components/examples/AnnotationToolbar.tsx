import { useState } from 'react';
import { AnnotationToolbar } from '../AnnotationToolbar';
import { ThemeProvider } from '../ThemeProvider';
import type { AnnotationType, HighlightColor } from '@shared/schema';

export default function AnnotationToolbarExample() {
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null);
  const [activeColor, setActiveColor] = useState<HighlightColor>("yellow");

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <AnnotationToolbar
          activeTool={activeTool}
          activeColor={activeColor}
          onToolChange={(tool) => {
            console.log('Tool changed to:', tool);
            setActiveTool(tool);
          }}
          onColorChange={(color) => {
            console.log('Color changed to:', color);
            setActiveColor(color);
          }}
        />
      </div>
    </ThemeProvider>
  );
}
