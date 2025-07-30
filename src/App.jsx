// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import PokemonDetail from './components/PokemonDetail';
// import './App.css'; // Se você tinha o App.css antes, pode descomentar. Mas se apagou, mantenha comentado.

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;