import { useState } from 'react';
import { Toolbar } from '../Toolbar';
import { ThemeProvider } from '../ThemeProvider';

export default function ToolbarExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <Toolbar
          currentPage={currentPage}
          totalPages={3}
          zoom={zoom}
          isSidebarOpen={isSidebarOpen}
          onPageChange={(page) => {
            console.log('Page changed to:', page);
            setCurrentPage(page);
          }}
          onZoomChange={(newZoom) => {
            console.log('Zoom changed to:', newZoom);
            setZoom(newZoom);
          }}
          onToggleSidebar={() => {
            console.log('Sidebar toggled');
            setIsSidebarOpen(!isSidebarOpen);
          }}
          onSearchToggle={() => console.log('Search toggled')}
          onAnnotateToggle={() => console.log('Annotate toggled')}
        />
      </div>
    </ThemeProvider>
  );
}
