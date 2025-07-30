// src/components/__tests__/Header.test.jsx

// Importa as ferramentas necessárias do React Testing Library
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Para ter acesso a matchers como .toBeInTheDocument()

// Importa o componente que queremos testar
import Header from '../Header';

// Importa o ThemeProvider e ThemeContext para simular o ambiente do tema
import ThemeContext, { ThemeProvider } from '../../context/ThemeContext';

// Descreve um grupo de testes para o componente Header
describe('Header Component', () => {

    // Antes de cada teste, vamos renderizar o Header dentro do ThemeProvider
    // para que ele tenha acesso ao contexto do tema.
    const renderHeaderWithTheme = () => {
        render(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );
    };

    test('deve renderizar o título correto', () => {
        renderHeaderWithTheme();
        // Verifica se o texto "Minha Super Pokédex!" está na tela
        expect(screen.getByText('Minha Super Pokédex!')).toBeInTheDocument();
    });

    test('deve renderizar o botão de alternar tema', () => {
        renderHeaderWithTheme();
        // Verifica se um botão com o texto "Modo Escuro" ou "Modo Claro" está na tela
        expect(screen.getByRole('button', { name: /Modo (Escuro|Claro)/i })).toBeInTheDocument();
    });

    test('deve alternar o texto do botão quando clicado', () => {
        renderHeaderWithTheme();
        const themeButton = screen.getByRole('button', { name: /Modo (Escuro|Claro)/i });

        // Verifica o estado inicial (pode ser "Modo Escuro" ou "Modo Claro", dependendo do useState inicial)
        // Por padrão, isDarkMode é false, então o texto inicial é "Modo Escuro".
        expect(themeButton).toHaveTextContent('Modo Escuro');

        // Simula um clique no botão
        fireEvent.click(themeButton);

        // Verifica se o texto mudou para "Modo Claro" após o clique
        expect(themeButton).toHaveTextContent('Modo Claro');

        // Simula outro clique
        fireEvent.click(themeButton);

        // Verifica se o texto voltou para "Modo Escuro"
        expect(themeButton).toHaveTextContent('Modo Escuro');
    });
});