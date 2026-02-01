/**
 * Application Entry Point
 * 
 * Bootstraps the React application with providers.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SessionProvider } from './core/providers/SessionProvider';
import Application from './Application';
import './styles/global.css';

const rootElement = document.getElementById('app-root');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <Application />
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>
);
