import { SearchPanel } from '../SearchPanel';
import { ThemeProvider } from '../ThemeProvider';

export default function SearchPanelExample() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <SearchPanel
          onSearch={(query) => console.log('Searching for:', query)}
          onClose={() => console.log('Search closed')}
        />
      </div>
    </ThemeProvider>
  );
}
