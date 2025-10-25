import Reader from '../Reader';
import { ThemeProvider } from '../../components/ThemeProvider';

export default function ReaderExample() {
  return (
    <ThemeProvider>
      <Reader />
    </ThemeProvider>
  );
}
