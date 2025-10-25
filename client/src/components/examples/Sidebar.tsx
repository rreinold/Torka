import { useState } from 'react';
import { Sidebar } from '../Sidebar';
import { ThemeProvider } from '../ThemeProvider';
import type { Annotation, Bookmark, Note } from '@shared/schema';

export default function SidebarExample() {
  const [annotations] = useState<Annotation[]>([
    {
      id: '1',
      type: 'highlight',
      pageNumber: 1,
      color: 'yellow',
      textSelection: {
        start: 0,
        end: 50,
        text: 'Torque, often referred to as the moment of force',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'note',
      pageNumber: 2,
      content: 'Important concept for automotive engineering',
      textSelection: {
        start: 0,
        end: 30,
        text: 'engine torque determines',
      },
      createdAt: new Date().toISOString(),
    },
  ]);

  const [bookmarks] = useState<Bookmark[]>([
    {
      id: '1',
      label: 'Introduction to Torque',
      pageNumber: 1,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [notes] = useState<Note[]>([
    {
      id: '1',
      content: 'Key takeaways from this document...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  return (
    <ThemeProvider>
      <div className="h-screen">
        <Sidebar
          annotations={annotations}
          bookmarks={bookmarks}
          notes={notes}
          onAnnotationClick={(ann) => console.log('Clicked annotation:', ann)}
          onBookmarkClick={(bm) => console.log('Clicked bookmark:', bm)}
          onAnnotationDelete={(id) => console.log('Delete annotation:', id)}
          onBookmarkDelete={(id) => console.log('Delete bookmark:', id)}
          onBookmarkAdd={(label, page) => console.log('Add bookmark:', label, page)}
          onNoteUpdate={(content) => console.log('Note updated:', content)}
        />
      </div>
    </ThemeProvider>
  );
}
