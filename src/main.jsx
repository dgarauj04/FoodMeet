import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CompareProvider } from './context/CompareContext';
import { AppRoutes } from './AppRoutes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <FavoritesProvider>
        <CompareProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CompareProvider>
      </FavoritesProvider>
    </ThemeProvider>
  </StrictMode>
);
