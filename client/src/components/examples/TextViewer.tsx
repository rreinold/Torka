import { useState } from 'react';
import { TextViewer } from '../TextViewer';
import { sampleDocument } from '../../lib/sampleText';
import { ThemeProvider } from '../ThemeProvider';

export default function TextViewerExample() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <ThemeProvider>
      <div className="h-screen">
        <TextViewer
          sections={sampleDocument.sections}
          currentPage={currentPage}
          zoom={100}
          searchQuery=""
          onPageChange={setCurrentPage}
          activeSectionId={sampleDocument.sections[currentPage - 1]?.id ?? 0}
        />
      </div>
    </ThemeProvider>
  );
}
