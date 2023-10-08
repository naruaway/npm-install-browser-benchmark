import { createRoot } from 'react-dom/client';
import { App } from './App.js';

const root = createRoot(document.getElementById('main')!);
root.render(<App />);
