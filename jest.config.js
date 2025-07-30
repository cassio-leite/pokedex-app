// jest.config.js
// Usamos 'export default' aqui para compatibilidade com ES Modules
export default {
    // O ambiente de teste, geralmente 'jsdom' para testes de componentes React (simula um navegador)
    testEnvironment: 'jsdom',

    // Arquivos que o Jest deve processar com o babel-jest (seu código JS/JSX)
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },

    // Módulos que o Jest deve ignorar a transformação (normalmente node_modules)
    // Mas não ignore 'styled-components' para que o Jest o processe
    transformIgnorePatterns: [
        '/node_modules/(?!styled-components)/',
    ],

    // Configurações para módulos que não são JS/JSX (como CSS ou imagens)
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // Ignora estilos
    },

    // Configura os arquivos que o Jest deve rodar antes dos testes
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};