// src/components/AppThemingWrapper.jsx

import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext'; // <--- MUDANÇA AQUI (sem chaves)!
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import App from '../App';

const AppThemingWrapper = () => {
    const { theme } = useContext(ThemeContext);

    return (
        <StyledThemeProvider theme={theme}>
            <GlobalStyle />
            <App />
        </StyledThemeProvider>
    );
};

export default AppThemingWrapper;