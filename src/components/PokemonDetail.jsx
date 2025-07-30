// src/components/PokemonDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Seus styled components do PokemonDetail
const DetailContainer = styled.div`
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    padding: 20px;
    min-height: calc(100vh - 80px); /* Para cobrir a altura total da tela */
    display: flex;
    flex-direction: column;
    align-items: center; /* Centraliza o conteúdo */
`;

const PokemonName = styled.h1`
    text-align: center;
    margin-bottom: 20px;
    color: ${(props) => props.theme.primary}; /* Nome em destaque com a cor primária do tema */
`;

const ImageTypeSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const PokemonImage = styled.img`
    width: 250px;
    height: 250px;
    object-fit: contain;
    margin-bottom: 10px; /* Espaço abaixo da imagem */
`;

const InfoGrid = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%; /* Ocupa a largura total disponível */
    max-width: 900px; /* Limita a largura máxima */
`;

const InfoCard = styled.div`
    flex: 1;
    min-width: 280px;
    background-color: ${(props) => props.theme.cardBackground};
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const StyledList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const ListItem = styled.li`
    margin-bottom: 8px;
    &:last-child {
    margin-bottom: 0; /* Remove margem do último item */
    }
`;

const StatusMessage = styled.p`
    color: ${(props) => (props.isError ? 'red' : props.theme.text)};
    text-align: center;
    margin-top: 50px;
    font-size: 1.2em;
`;


function PokemonDetail() {
    // Não precisamos do 'theme' aqui para passar para os styled components.
    // O StyledThemeProvider já faz isso.
    // const { theme } = useContext(ThemeContext);
    const { id } = useParams();

    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPokemonDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`);
            const pokemonData = response.data;

            const abilitiesWithDescriptions = await Promise.all(
                pokemonData.abilities.map(async (abilityInfo) => {
                    const abilityResponse = await axios.get(abilityInfo.ability.url);
                    const effectEntry = abilityResponse.data.effect_entries.find(
                        (entry) => entry.language.name === 'en'
                    );
                    return {
                        name: abilityInfo.ability.name,
                        description: effectEntry ? effectEntry.effect : 'Descrição não encontrada.',
                    };
                })
            );

            setPokemon({ ...pokemonData, abilities: abilitiesWithDescriptions });

        } catch (err) {
            console.error("Erro ao buscar detalhes do Pokémon:", err);
            setError("Não foi possível carregar os detalhes do Pokémon. Tente novamente!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPokemonDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <DetailContainer> {/* Remova theme={theme} aqui */}
                <StatusMessage>Carregando detalhes do Pokémon...</StatusMessage> {/* Remova theme={theme} aqui */}
            </DetailContainer>
        );
    }

    if (error) {
        return (
            <DetailContainer> {/* Remova theme={theme} aqui */}
                <StatusMessage isError={true}>{error}</StatusMessage> {/* Remova theme={theme} aqui */}
            </DetailContainer>
        );
    }

    if (!pokemon) {
        return (
            <DetailContainer> {/* Remova theme={theme} aqui */}
                <StatusMessage>Pokémon não encontrado.</StatusMessage> {/* Remova theme={theme} aqui */}
            </DetailContainer>
        );
    }

    return (
        <DetailContainer> {/* Remova theme={theme} aqui */}
            <PokemonName>{pokemon.name.toUpperCase()}</PokemonName> {/* Remova theme={theme} aqui */}

            <ImageTypeSection>
                <PokemonImage
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                />
                <p><strong>Tipo:</strong> {pokemon.types.map(typeInfo => typeInfo.type.name.toUpperCase()).join(', ')}</p>
            </ImageTypeSection>

            <InfoGrid>
                <InfoCard> {/* Remova theme={theme} aqui */}
                    <h3>Movimentos:</h3>
                    <StyledList>
                        {pokemon.moves.slice(0, 10).map((moveInfo, index) => (
                            <ListItem key={index}>
                                {moveInfo.move.name.replace(/-/g, ' ').toUpperCase()}
                            </ListItem>
                        ))}
                    </StyledList>
                </InfoCard>

                <InfoCard> {/* Remova theme={theme} aqui */}
                    <h3>Habilidades:</h3>
                    <StyledList>
                        {pokemon.abilities.map((ability, index) => (
                            <ListItem key={index}>
                                <strong>{ability.name.replace(/-/g, ' ').toUpperCase()}:</strong> {ability.description}
                            </ListItem>
                        ))}
                    </StyledList>
                </InfoCard>
            </InfoGrid>
        </DetailContainer>
    );
}

export default PokemonDetail;