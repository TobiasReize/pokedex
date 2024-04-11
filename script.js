let currentPokemon;
let pokemonInfos = [];
let start = 1;
let end = 21;


async function init() {
    await loadPokemon();
    renderPokemonCard();
}


async function loadPokemon() {        //Ladet die Pokemon-Infos von der API herunter
    for (let i = start; i < end; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        savePokemonInfos();
    }
    console.log(pokemonInfos);
}


function savePokemonInfos() {               //Speichert die Pokemon-Infos in einem globalen Array
    let pokemonId = currentPokemon['id'];
    let pokemonName = currentPokemon['name'];
    let pokemonImgSrc = currentPokemon['sprites']['other']['dream_world']['front_default'];
    let pokemonTypes = currentPokemon['types'];
    let types = [];

    for (let j = 0; j < pokemonTypes.length; j++) {
        const pokemonType = pokemonTypes[j];
        types.push(pokemonType['type']['name']);
    }

    let pokemonInfo = {
        'id': pokemonId,
        'name': pokemonName,
        'imgSrc': pokemonImgSrc,
        'types': types
    };
    pokemonInfos.push(pokemonInfo);
}


function renderPokemonCard() {              //Rendert die Pokemon-Karten
    let pokemonList = document.getElementById('pokemon_list');
    pokemonList.innerHTML = '';

    for (let k = 0; k < pokemonInfos.length; k++) {
        const pokemon = pokemonInfos[k];
        pokemonList.innerHTML += /*html*/ `
            <div class="pokemon-card">
                <div class="pokemon-id">#${alwaysThreeDigits(pokemon['id'])}</div>
                <div class="pokemon-name">${firstLetterUppercase(pokemon['name'])}</div>
                <div class="type-img-container">
                    <div id="pokemon_type_container_${k}" class="pokemon-type-container"></div>
                    <img class="pokemon-img" src="${pokemon['imgSrc']}" alt="Image" />
                </div>
            </div>
        `;

        for (let l = 0; l < pokemon['types'].length; l++) {
            const type = pokemon['types'][l];
            document.getElementById(`pokemon_type_container_${k}`).innerHTML += /*html*/ `
                <div class="pokemon-type">${firstLetterUppercase(type)}</div>
            `;
        }
    }
}


function firstLetterUppercase(word) {           //Hilfsfunktion, damit der erste Buchstabe großgeschrieben wird
    return word.charAt(0).toUpperCase() + word.slice(1);
}


function alwaysThreeDigits(number) {            //Hilfsfunktion, damit die ID immer drei Stellen hat
    return ('00' + number.toString()).slice(-3);
}


function loadMorePokemon() {
    start = start + 20;
    end = end + 20;
}