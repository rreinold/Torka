import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <p>Theme Provider is active (check browser storage)</p>
      </div>
    </ThemeProvider>
  );
}
