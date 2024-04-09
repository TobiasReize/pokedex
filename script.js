let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/1';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);
    renderPokemonInfo();
}


function renderPokemonInfo() {
    let pokemonId = currentPokemon['id'];
    let pokemonName = currentPokemon['name'];
    let pokemonImg = currentPokemon['sprites']['other']['dream_world']['front_default'];
    let pokemonTypes = currentPokemon['types'];

    document.getElementById('pokemon_id').innerHTML = `#${pokemonId}`;
    document.getElementById('pokemon_name').innerHTML = pokemonName;
    document.getElementById('pokemon_img').src = pokemonImg;

    document.getElementById('pokemon_type_container').innerHTML = '';
    for (let i = 0; i < pokemonTypes.length; i++) {
        const pokemonType = pokemonTypes[i];
        document.getElementById('pokemon_type_container').innerHTML += /*html*/ `
            <div class="pokemon_type">${pokemonType['type']['name']}</div>
        `;
    }
}