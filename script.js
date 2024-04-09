let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/1';
    let response = await fetch(url);
    currentPokemon = await response.json();
    console.log(currentPokemon);
    renderPokemonInfo();
}


function renderPokemonInfo() {
    document.getElementById('pokemon').innerHTML = currentPokemon['name'];
}