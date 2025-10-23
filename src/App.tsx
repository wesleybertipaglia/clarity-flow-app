import { Toaster } from 'sonner';
import Router from './router';
import { ThemeProvider } from '@/contexts/ThemeContext';

function App() {
  return (
    <div className="min-h-screen bg-background font-body antialiased">
      <ThemeProvider>
        <Router />
      </ThemeProvider>
      <Toaster />
    </div>
  );
}

export default App;
