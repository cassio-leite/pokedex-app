// src/styles/GlobalStyle.jsx

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Reset básico para remover margens e paddings padrão dos navegadores */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    /* REMOVA estas linhas! O ThemeContext.jsx já está aplicando as cores ao body via useEffect */
    /* background-color: ${(props) => props.theme.background}; */
    /* color: ${(props) => props.theme.text}; */
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 10px;
    color: ${(props) => props.theme.primary}; /* Agora, props.theme funciona automaticamente! */
  }

  p {
    margin-bottom: 10px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Estilo para a barra de rolagem, para deixar mais bonita (opcional) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.primary}; /* props.theme funciona automaticamente! */
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.cardBackground}; /* props.theme funciona automaticamente! */
  }
`;

export default GlobalStyle;