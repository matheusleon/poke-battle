function clearMenu() {
    var pokemon_menu = document.querySelector('#pokemon-menu');
    pokemon_menu.innerHTML = "";
}

// TODO: Create functions to change visibility of menu and game
// fuction changeVisibility() {}

function capitalizeFirstvarter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemonDropdownLists() {
    fetchKantoPokemon().then(allPokemons => {  
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown1');
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown2');
    });
} 

function renderPokemonDropdownList(allPokemons, dropdownlist_name) {
    var dropdown = document.getElementById(dropdownlist_name);
    dropdown.length = 0;

    var defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your Pokemon';
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    for (var i = 0; i < allPokemons.length; i++) {
        var option = document.createElement('option');
        option.text = capitalizeFirstvarter(allPokemons[i].name);
        option.value = allPokemons[i].name;
        dropdown.add(option);
    }
}

function fetchKantoPokemon() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(function(allPokemon) {
            return allPokemon;
        })
}

function renderPokemonImage(pokemon_name, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;

    fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        var poke_img = document.getElementById(`pokemon${player_id}-img`)
        poke_img.srcset = `https://pokeres.bastionbot.org/images/pokemon/${pokemon_data.id}.png`
    })
}

async function getPokemonMoves(pokemon_name) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    var moves = []

    await fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        pokemon_data.moves.forEach(element => {
            if (moves.length < 4 && element.version_group_details[0].move_learn_method.name == 'level-up') {
                moves.push(element.move.name)
            }
        });
    })
    return moves;
}

function renderPokemonMoves(pokemon_name, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    
    getPokemonMoves(pokemon_name).then(moves => {
        counter = 0
        for (var i = 0; i < 4; i++) {
            var button_name = `pokemon${player_id}-move${i}`;
            var poke_move = document.getElementById(button_name)
            poke_move.innerHTML = moves[i];
            poke_move.style.visibility = "visible";
        }
    });
}

function renderPokemonName(pokemon_name, player_id) {
    var pokeName = document.getElementById(`pokemon${player_id}-name`) 
    pokeName.innerText = pokemon_name
}

function renderPokemon(pokemon_name, player_id) {
    var poke_container = document.getElementById("player" + player_id)

    renderPokemonImage(pokemon_name, player_id);
    renderPokemonMoves(pokemon_name, player_id);
    renderPokemonName(pokemon_name, player_id);
}

function startSingleplayer() {
    //renderPokemonDropdownLists(); 
    playGame();
}

function playGame() {
    //var pokemon1 = document.getElementById('pokemon_names_dropdown1').value
    //var pokemon2 = document.getElementById('pokemon_names_dropdown2').value
    var pokemon1 = 'charmander';
    var pokemon2 = 'squirtle';

    renderPokemon(pokemon1, 0);
    renderPokemon(pokemon2, 1);
    clearMenu();
}
