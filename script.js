let currentPokemon;
let pokemonInfos = [];
let start = 1;
let end = 21;

let cardBgColor = {
    'bug': 'rgb(139, 22, 22)',
    'dark': 'rgb(47, 79, 79)',
    'dragon': 'rgb(93, 56, 255)',
    'electric': 'rgb(241, 220, 0)',
    'fairy': 'rgb(255, 192, 203)',
    'fighting': 'rgb(191, 71, 71)',
    'fire': 'rgb(233, 0, 0)',
    'flying': 'rgb(135, 206, 235)',
    'ghost': 'rgb(75, 0, 130)',
    'grass': 'rgb(50, 205, 50)',
    'ground': 'rgb(139, 69, 19)',
    'ice': 'rgb(173, 216, 230)',
    'normal': 'rgb(128, 128, 128)',
    'poison': 'rgb(128, 0, 128)',
    'psychic': 'rgb(210, 26, 215)',
    'rock': 'rgb(210, 180, 140)',
    'shadow': 'rgb(30, 30, 30)',
    'steel': 'rgb(169, 169, 169)',
    'unknown': 'rgb(130, 130, 130)',
    'water': 'rgb(45, 131, 255)'
}


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

    for (let i = 0; i < pokemonTypes.length; i++) {
        const pokemonType = pokemonTypes[i];
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

    for (let i = 0; i < pokemonInfos.length; i++) {
        const pokemon = pokemonInfos[i];
        pokemonList.innerHTML += pokemonCardHTML(i, pokemon);
        
        for (let j = 0; j < pokemon['types'].length; j++) {
            const type = pokemon['types'][j];
            document.getElementById(`pokemon_type_container_${i}`).innerHTML += /*html*/ `
                <div class="pokemon-type">${firstLetterUppercase(type)}</div>
            `;
        }
        document.getElementById(`pokemon_card_${i}`).style.backgroundColor = `${cardBgColor[pokemon['types'][0]]}`;
    }
}


function pokemonCardHTML(i, pokemon) {
    return  /*html*/ `
        <div id="pokemon_card_${i}" class="pokemon-card">
            <div class="pokemon-id">#${alwaysThreeDigits(pokemon['id'])}</div>
            <div class="pokemon-name">${firstLetterUppercase(pokemon['name'])}</div>
            <div class="type-img-container">
                <div id="pokemon_type_container_${i}" class="pokemon-type-container"></div>
                <img class="pokemon-img" src="${pokemon['imgSrc']}" alt="Image" />
            </div>
        </div>
    `;
}


function firstLetterUppercase(word) {           //Hilfsfunktion, damit der erste Buchstabe großgeschrieben wird
    return word.charAt(0).toUpperCase() + word.slice(1);
}


function alwaysThreeDigits(number) {            //Hilfsfunktion, damit die ID immer drei Stellen hat
    return ('00' + number.toString()).slice(-3);
}


async function loadMorePokemon() {          //Ladet die nächsten Pokemon und zeigt währenddessen eine Ladeanimation an
    let loadButton = document.getElementById('button_container');
    loadButton.innerHTML = /*html*/ `Loading...<img class="pokeball-load" src="./img/pokeball-load.png" alt="pokeball-load">`;
    start = start + 20;
    end = end + 20;
    await init();
    loadButton.innerHTML = /*html*/ `
        <button class="load-more-button" onclick="loadMorePokemon()">
            Load more
            <img class="load-button-img" src="./img/pokeball-btn.png" alt="Pokeball">
        </button>
    `;
}