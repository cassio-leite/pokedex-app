// src/components/Home.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// --- Lista de tipos de Pokémon ---
const pokemonTypes = [
    'all',
    'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost',
    'dragon', 'steel', 'fairy'
];

// --- Seus Styled Components Existentes ---
const HomeContainer = styled.div`
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    padding: 20px;
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;

const PokemonGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 900px;
    justify-content: center;
    padding: 20px 0;
`;

const PokemonCard = styled(Link)`
    background-color: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.text};
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    h3 {
        color: ${(props) => props.theme.primary};
        margin-top: 10px;
        font-size: 1.1em;
        text-transform: capitalize;
    }
`;

const PokemonImage = styled.img`
    width: 100px;
    height: 100px;
`;

const PokemonTypesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    margin-top: 5px;
`;

const PokemonTypeTag = styled.span`
    background-color: rgba(0,0,0,0.1);
    color: ${(props) => props.theme.text};
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    text-transform: capitalize;
`;

const LoadMoreButton = styled.button`
    background-color: ${(props) => props.theme.primary};
    color: #fff;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
    margin-top: 20px;

    &:hover {
        background-color: ${(props) => props.theme.primary + 'cc'};
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

// --- NOVOS Styled Components para o Filtro ---
const FilterContainer = styled.div`
    text-align: center;
    margin-bottom: 20px;
`;

const TypeSelect = styled.select`
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.text};
    font-size: 1rem;
    cursor: pointer;
    min-width: 150px;
`;


function Home() {
    const [pokemonList, setPokemonList] = useState([]); // Armazena TODOS os pokemons carregados da API
    const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=10'); // URL para a próxima leva de pokemons
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('all'); // Tipo de filtro selecionado
    // O estado 'filteredPokemon' se torna menos essencial com a nova estratégia,
    // pois 'pokemonList' já será a lista filtrada/total dependendo do 'selectedType'.
    // Vamos simplificar e usar 'pokemonList' diretamente na renderização após a busca.

    // Usamos useCallback para memoizar a função fetchPokemons e evitar re-renderizações desnecessárias
    const fetchPokemons = useCallback(async (urlToFetch, isNewSearch = false) => {
        setLoading(true);
        try {
            let currentUrl = urlToFetch;
            let fetchedPokemons = [];
            let next = null;

            if (selectedType === 'all') {
                // Lógica para carregar todos os pokemons (paginado)
                const response = await axios.get(currentUrl);
                const data = response.data;
                fetchedPokemons = data.results;
                next = data.next;
            } else {
                // Lógica para carregar por tipo (sem paginação, busca todos de uma vez)
                // O endpoint /type/{name} lista todos os pokemons daquele tipo.
                const response = await axios.get(`https://pokeapi.co/api/v2/type/${selectedType}/`);
                const data = response.data;
                // O endpoint de tipo retorna a lista de pokemons de forma diferente
                fetchedPokemons = data.pokemon.map(p => p.pokemon); // Obtém o objeto 'pokemon' dentro de cada item
                next = null; // Para tipo específico, não há "próxima página" via PokeAPI para esta lista
            }

            // Agora, para cada Pokémon (seja da lista geral ou da lista de tipo),
            // buscamos os detalhes para obter a imagem e os tipos.
            const detailedPokemonPromises = fetchedPokemons.map(async (pokemon) => {
                const pokemonResponse = await axios.get(pokemon.url);
                return pokemonResponse.data;
            });

            const detailedPokemons = await Promise.all(detailedPokemonPromises);

            setPokemonList(prevList => {
                if (isNewSearch) { // Se for uma nova busca (mudança de filtro ou primeira carga)
                    return detailedPokemons; // Substitui a lista completamente
                } else { // Se for um "Carregar Mais" para o filtro 'all'
                    const existingIds = new Set(prevList.map(p => p.id));
                    const newUniquePokemons = detailedPokemons.filter(p => !existingIds.has(p.id));
                    return [...prevList, ...newUniquePokemons];
                }
            });

            setNextUrl(next);

        } catch (error) {
            console.error("Erro ao buscar Pokémons com Axios:", error);
            // Implemente um estado de erro aqui se quiser exibir para o usuário
        } finally {
            setLoading(false);
        }
    }, [selectedType]); // selectedType é uma dependência porque a URL de busca depende dele

    // --- useEffect para disparar a busca inicial ou quando o filtro muda ---
    useEffect(() => {
        // Se o tipo mudar, ou se for a primeira carga e pokemonList estiver vazia
        // e a nextUrl inicial estiver definida.
        if (pokemonList.length === 0 && selectedType === 'all' && nextUrl) {
            // Primeira carga para 'all'
            fetchPokemons(nextUrl, true);
        } else if (selectedType !== 'all') {
            // Nova busca quando um tipo específico é selecionado
            // Resetamos a lista e buscamos apenas os daquele tipo
            setPokemonList([]); // Limpa a lista existente
            setNextUrl(null); // Desabilita o "Carregar Mais" para este tipo
            fetchPokemons(`https://pokeapi.co/api/v2/type/${selectedType}/`, true);
        } else if (selectedType === 'all' && pokemonList.length === 0 && nextUrl) {
            // Garante que 'all' carregue se a lista estiver vazia e não for uma primeira carga já tratada.
            // Isso pode acontecer se o usuário limpar os filtros após uma busca por tipo, por exemplo.
            fetchPokemons(nextUrl, true);
        }
    }, [selectedType]); // Este useEffect depende de selectedType

    // Função para lidar com o clique no botão "Carregar Mais"
    const handleLoadMore = () => {
        if (nextUrl && !loading) {
            fetchPokemons(nextUrl, false); // Não é uma nova busca, é um "Carregar Mais"
        }
    };

    // Função para lidar com a mudança no select de tipo
    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        // O useEffect acima irá disparar a busca correta quando selectedType mudar
    };

    // --- RENDERIZAÇÃO ---
    return (
        <HomeContainer>
            <h1>Bem-vindo à Pokédex!</h1>
            <p>Aqui você verá uma lista de Pokémons!</p>

            {/* --- CAMPO DE FILTRO --- */}
            <FilterContainer>
                <label htmlFor="pokemon-type-filter" style={{ marginRight: '10px' }}>Filtrar por Tipo:</label>
                <TypeSelect id="pokemon-type-filter" onChange={handleTypeChange} value={selectedType}>
                    {pokemonTypes.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </TypeSelect>
            </FilterContainer>

            <PokemonGrid>
                {pokemonList.length > 0 ? (
                    pokemonList.map(pokemon => ( // Renderiza pokemonList diretamente
                        <PokemonCard to={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                            <PokemonImage src={pokemon.sprites.front_default} alt={pokemon.name} loading='lazy' />
                            <h3>{pokemon.name}</h3>
                            {pokemon.types && pokemon.types.length > 0 && (
                                <PokemonTypesContainer>
                                    {pokemon.types.map(typeInfo => (
                                        <PokemonTypeTag key={typeInfo.type.name}>
                                            {typeInfo.type.name}
                                        </PokemonTypeTag>
                                    ))}
                                </PokemonTypesContainer>
                            )}
                        </PokemonCard>
                    ))
                ) : (
                    !loading && (
                        selectedType !== 'all' ? (
                            <p style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}>Nenhum Pokémon encontrado para este tipo.</p>
                        ) : (
                            <p style={{ textAlign: 'center', width: '100%', marginTop: '20px' }}>Nenhum Pokémon carregado ainda.</p>
                        )
                    )
                )}
            </PokemonGrid>

            {loading && <p style={{ textAlign: 'center', width: '100%' }}>Carregando Pokémons...</p>}

            {/* --- Botão "Carregar Mais" - Visível SOMENTE se o filtro for 'all' --- */}
            {nextUrl && !loading && selectedType === 'all' && (
                <LoadMoreButton
                    onClick={handleLoadMore} // Chamada para a nova função
                    disabled={loading}
                >
                    Carregar Mais Pokémons
                </LoadMoreButton>
            )}
        </HomeContainer>
    );
}

export default Home;