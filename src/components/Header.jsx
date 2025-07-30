// src/components/Header.jsx

import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext'; // Importe ThemeContext
import styled from 'styled-components';

// Seus styled components do Header
const StyledHeader = styled.header`
  background-color: ${(props) => props.theme.background}; /* props.theme vem do StyledThemeProvider */
  color: ${(props) => props.theme.text};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ThemeToggleButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primary + 'cc'};
  }
`;

function Header() {
  // Use useContext para obter isDarkMode e toggleTheme (o theme também vem, mas não precisamos passar para os Styled Components)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <StyledHeader> {/* NÃO precisa mais de theme={theme} aqui! */}
      <h2>Minha Super Pokédex!</h2>
      <ThemeToggleButton onClick={toggleTheme}> {/* NÃO precisa mais de theme={theme} aqui! */}
        {isDarkMode ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
      </ThemeToggleButton>
    </StyledHeader>
  );
}

export default Header;