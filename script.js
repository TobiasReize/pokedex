let currentPokemon;
let allLoadedPokemons = [];
let filteredPokemons = [];
let renderedPokemons = [];
let pokemonStatNames = ['HP', 'Attack', 'Defense', 'Sp-Attack', 'Sp-Defense', 'Speed'];
let start = 1;
let end = 20;
let cardBgColor = {
    'bug': 'rgb(121, 157, 28)',
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
    'normal': 'rgb(150, 150, 150)',
    'poison': 'rgb(128, 0, 128)',
    'psychic': 'rgb(210, 26, 215)',
    'rock': 'rgb(210, 180, 140)',
    'shadow': 'rgb(30, 30, 30)',
    'steel': 'rgb(169, 169, 169)',
    'unknown': 'rgb(130, 130, 130)',
    'water': 'rgb(45, 131, 255)'
}

// Chart-JS Variablen:
const CHART_CONFIG_BG_COLOR = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)'
];
const CHART_CONFIG_BRD_COLOR = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)'
];
const CHART_CONFIG_OPTIONS = {
    indexAxis: 'y',
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false,
        }
    }
};


async function init() {
    await loadPokemon();
    renderPokemonCard();
    endLoadingAnimation();
}


async function loadPokemon() {        //Ladet die Pokemon-Infos von der API herunter
    for (let i = start; i < end + 1; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        savePokemonInfos();
    }
    renderedPokemons = allLoadedPokemons;
}


function savePokemonInfos() {               //Speichert die Pokemon-Infos in einem globalen Array
    let pokemonId = currentPokemon['id'];
    let pokemonName = currentPokemon['name'];
    let pokemonImgSrc = currentPokemon['sprites']['other']['dream_world']['front_default'];
    let pokemonTypes = currentPokemon['types'];
    let pokemonStats = currentPokemon['stats'];
    let types = [];
    let stats = [];
    let pokemonInfo = {};

    for (let i = 0; i < pokemonTypes.length; i++) {
        const pokemonType = pokemonTypes[i];
        types.push(pokemonType['type']['name']);
    }

    for (let j = 0; j < pokemonStats.length; j++) {
        const pokemonStat = pokemonStats[j];
        stats.push(pokemonStat['base_stat']);
    }

    pokemonInfo = {
        'id': pokemonId,
        'name': pokemonName,
        'imgSrc': pokemonImgSrc,
        'types': types,
        'stats': stats
    };
    allLoadedPokemons.push(pokemonInfo);
}


function renderPokemonCard() {              //Rendert die Pokemon-Karten
    let pokemonList = document.getElementById('pokemon_list');
    pokemonList.innerHTML = '';

    for (let i = 0; i < renderedPokemons.length; i++) {
        const pokemon = renderedPokemons[i];
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


function pokemonCardHTML(i, pokemon) {          //HTML-Template für die Pokemon-Karten
    return  /*html*/ `
        <div id="pokemon_card_${i}" class="pokemon-card" onclick="showBigView(${i})">
            <div class="pokemon-id">#${alwaysThreeDigits(pokemon['id'])}</div>
            <div class="pokemon-name">${firstLetterUppercase(pokemon['name'])}</div>
            <div class="type-img-container">
                <div id="pokemon_type_container_${i}" class="pokemon-type-container"></div>
                <img class="pokemon-img" src="${pokemon['imgSrc']}" alt="Image" />
            </div>
        </div>
    `;
}


async function loadMorePokemon() {          //Ladet die nächsten Pokemon und zeigt währenddessen eine Ladeanimation an
    startLoadingAnimation();
    start = start + 20;
    end = end + 20;
    init();
}


function startLoadingAnimation() {          //startet die Ladeanimation
    let loadButton = document.getElementById('load_button_container');
    loadButton.innerHTML = /*html*/ `<b>Loading...</b><img class="pokeball-load" src="./img/pokeball-load.png" alt="pokeball-load">`;
}


function endLoadingAnimation() {            //beendet die Ladeanimation und zeigt den Load more-button an
    let loadButton = document.getElementById('load_button_container');
    loadButton.innerHTML = /*html*/ `
        <button class="load-more-button" onclick="loadMorePokemon()">
            Load more
            <img class="load-button-img" src="./img/pokeball-btn.png" alt="Pokeball">
        </button>
    `;
}


function showBigView(i) {               //Funktion zur Großansicht der Karten
    const pokemon = renderedPokemons[i];
    let bigViewContainer = document.getElementById('big_view_container');
    bigViewContainer.classList.remove('d-none');
    document.body.classList.add('overflow-hidden');
    bigViewContainer.innerHTML = bigViewHTML(i, pokemon);
    
    for (let j = 0; j < pokemon['types'].length; j++) {
        const type = pokemon['types'][j];
        document.getElementById(`big_view_type_container_${i}`).innerHTML += /*html*/ `
            <div class="pokemon-type">${firstLetterUppercase(type)}</div>
        `;
    }
    document.getElementById(`big_view_card_${i}`).style.backgroundColor = `${cardBgColor[pokemon['types'][0]]}`;
    statsChart(i);
}


function bigViewHTML(i, pokemon) {          //HTML-Template für die Großansicht
    return /*html*/ `
        <img class="arrow" onclick="previousPokemon(event, ${i})" src="./img/arrow-left.png" alt="arrow-left">
        <div onclick="stopPropagation(event)" id="big_view_card_${i}" class="big-view-card">
            <div class="upper-container">
                <div class="pokemon-id">#${alwaysThreeDigits(pokemon['id'])}</div>
                <div class="pokemon-name">${firstLetterUppercase(pokemon['name'])}</div>
                <div id="big_view_type_container_${i}" class="big-view-type-container"></div>
                <div class="big-view-img-container">
                    <img src="${pokemon['imgSrc']}" alt="Image">
                </div>
            </div>
            <div class="chart-container">
                <b>Pokemon stats:</b>
                <canvas id="myChart"></canvas>
            </div>
        </div>
        <img class="arrow" onclick="nextPokemon(event, ${i})" src="./img/arrow-right.png" alt="arrow-right">
    `;
}


function statsChart(i) {                //Funktion zur Darstellung des Statuswerte-Diagramms via Chart-JS
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pokemonStatNames,
            datasets: [{
                data: renderedPokemons[i]['stats'],
                backgroundColor: CHART_CONFIG_BG_COLOR,
                borderColor: CHART_CONFIG_BRD_COLOR,
                borderWidth: 1,
            }]
        },
        options: CHART_CONFIG_OPTIONS
    });
}


function closeBigView() {                   //schließt die Großansicht wieder
    let bigViewContainer = document.getElementById('big_view_container');
    bigViewContainer.classList.add('d-none');
    document.body.classList.remove('overflow-hidden');
}


function previousPokemon(event, i) {        //zeigt das vorherige Pokemon an
    let index;
    stopPropagation(event);
    if (i - 1 < 0) {
        index = renderedPokemons.length - 1;
    } else {
        index = i - 1;
    }
    showBigView(index);
}


function nextPokemon(event, i) {            //zeigt das nächste Pokemon an
    stopPropagation(event);
    if (i + 1 == renderedPokemons.length) {
        index = 0;
    } else {
        index = i + 1;
    }
    showBigView(index);
}


function searchPokemon() {                  //Funktion zum Suchen und Filtern der geladenen Pokemon, je nach Eingabe
    // let pokemonList = document.getElementById('pokemon_list');
    let inputField = document.getElementById('search_field').value;
    let input = inputField.trim().toLowerCase();
    filteredPokemons = [];
    renderedPokemons = allLoadedPokemons;   //damit auch alle Pokemon wieder angezeigt werden, wenn man die Eingabe wieder löscht

    if (input.length > 2) {
        for (let i = 0; i < renderedPokemons.length; i++) {
            const pokemon = renderedPokemons[i];
            if (pokemon['name'].includes(input)) {
                filteredPokemons.push(pokemon);
            } 
            // else {
            //     pokemonList.innerHTML = /*html*/ `<div class="no-search-result">Kein Pokemon gefunden!</div>`;
            // }
        }
        renderedPokemons = filteredPokemons;
        renderPokemonCard();
    } else if (input.length == 0) {     //falls die Eingabe wieder gelöscht wird
        renderPokemonCard();
    }
}


// Hilfsfunktionen:
function firstLetterUppercase(word) {           //Hilfsfunktion, damit der erste Buchstabe großgeschrieben wird
    return word.charAt(0).toUpperCase() + word.slice(1);
}


function alwaysThreeDigits(number) {            //Hilfsfunktion, damit die ID immer drei Stellen hat
    return ('00' + number.toString()).slice(-3);
}


function stopPropagation(event) {           //Verhindert das Event Bubbling beim Schließen der Großansicht
    event.stopPropagation();
}