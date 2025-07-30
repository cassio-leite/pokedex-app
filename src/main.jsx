// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Importe SEU ThemeContext sem chaves e ThemeProvider com chaves
import ThemeContext, { ThemeProvider as CustomThemeProvider } from './context/ThemeContext'; // <--- MUDANÇA AQUI!

// Importe o componente AppThemingWrapper
import AppThemingWrapper from './components/AppThemingWrapper';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <AppThemingWrapper />
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);