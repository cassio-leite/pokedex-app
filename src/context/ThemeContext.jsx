// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// 1. Criando o nosso "mural mágico" do tema
// createContext() cria um espaço onde vamos guardar a informação do tema.
// Exportamos como 'default' para ser importado sem chaves {}.
const ThemeContext = createContext({}); // Definimos sem 'export' aqui
export default ThemeContext; // <--- AGORA EXPORTAMOS COMO PADRÃO!

// 2. Definindo os nossos temas (claro e escuro) DIRETAMENTE AQUI.
// Não é exportado para fora deste arquivo.
const themes = {
    light: {
        background: '#f0f0f0',
        text: '#333',
        primary: '#4CAF50',
        cardBackground: '#fff'
    },
    dark: {
        background: '#333',
        text: '#f0f0f0',
        primary: '#66bb6a',
        cardBackground: '#444'
    }
};

// 3. Criando o nosso "Provedor" do tema
// Este componente envolve sua aplicação e fornece o tema para todos os componentes.
// Exportamos ele como nomeado, porque é um provedor e pode ser um de vários.
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    }

    const theme = isDarkMode ? themes.dark : themes.light;

    useEffect(() => {
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.text;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};