
var moves = new Array(2);
var health = new Array(2);
var max_health = new Array(2);
var pokemon = new Array(2);

const pokemon_menu = document.getElementById('pokemon-menu');
const pokemon_container = document.getElementById('pokemon-container');

function capitalizeFirstLetter(string) {
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
        option.text = capitalizeFirstLetter(allPokemons[i].name);
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
        poke_img.style.width = '400px';
        poke_img.style.height = 'auto';
    })
}

async function getPokemonMoves(pokemon_name, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;

    await fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        var counter = 0;
        pokemon_data.moves.forEach(element => {
            if (counter < 4 && element.version_group_details[0].move_learn_method.name == 'level-up') {
                moves[player_id][counter] = [element.move.name, element.move.url];
                counter++;
            }
        });
    })
    return moves;
}

function renderPokemonMoves(pokemon_name, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    moves[0] = new Array(4);
    moves[1] = new Array(4);
    
    getPokemonMoves(pokemon_name, player_id).then(moves => {
        counter = 0
        for (var i = 0; i < 4; i++) {
            var button_name = `pokemon${player_id}-move${i}`;
            var poke_move = document.getElementById(button_name);
            poke_move.innerHTML = moves[player_id][i][0];
            poke_move.style.visibility = "visible";
        }
    });
}

function renderPokemonName(pokemon_name, player_id) {
    var pokeName = document.getElementById(`pokemon${player_id}-name`);
    pokeName.innerText = capitalizeFirstLetter(pokemon_name);
}

async function renderPokemonHealth(pokemon_name, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;

    await fetch(pokemon_info_url)
    .then(response => response.json())
    .then(pokemon_data => {
        health[player_id] = pokemon_data.stats[0].base_stat;
        max_health[player_id] = pokemon_data.stats[0].base_stat;
    });

    var pokeHealth = document.getElementById(`pokemon${player_id}-health`);
    pokeHealth.innerText = `${health[player_id]} / ${max_health[player_id]}`;
}

function renderPokemon(pokemon_name, player_id) {
    var poke_container = document.getElementById("player" + player_id)

    renderPokemonImage(pokemon_name, player_id);
    renderPokemonMoves(pokemon_name, player_id);
    renderPokemonName(pokemon_name, player_id);
    renderPokemonHealth(pokemon_name, player_id);
}

function updatePokemonHealth(player_id) {
    var pokeHealth = document.getElementById(`pokemon${player_id}-health`);
    pokeHealth.innerText = `${health[player_id]} / ${max_health[player_id]}`;
}

async function playerMove(player_id, move_id) {
    var damage = 0
    var message = ''

    // Fetch move from Api. Ex.: https://pokeapi.co/api/v2/move/52/
    await fetch(moves[player_id][move_id][1])
    .then(response => response.json())
    .then(move_data => {
        damage = move_data.power
        message = move_data.flavor_text_entries[0].flavor_text
        health[player_id^1] = Math.max(0, health[player_id^1] - damage)
        updatePokemonHealth(player_id^1)
    })

    var moves_container = document.getElementById('moves-text');
    //moves_container.innerHTML += `Jogador 1 causou ${damage} de dano<br>`;
    moves_container.innerHTML += pokemon[player_id] + ' uses ' + moves[player_id][move_id][0] + `!<br>`;
    moves_container.innerHTML += message + `<br>`;
    
    enableButtons(player_id^1);
    disableButtons(player_id);

    if (health[0] <= 0 || health[1] <= 0) {
        endGame();
    }
}

function disableButtons(player_id) {
    for (var j = 0; j < 4; j++) {
        var button_name = `pokemon${player_id}-move${j}`;
        document.getElementById(button_name).disabled = true;
    }
}

function enableButtons(player_id) {
    for (var j = 0; j < 4; j++) {
        var button_name = `pokemon${player_id}-move${j}`;
        document.getElementById(button_name).disabled = false;
    }
}

function endGame() {
    disableButtons(0);
    disableButtons(1);

    if (health[0] <= 0) {
        var moves_container = document.getElementById('moves-text');
        moves_container.innerHTML += `Jogador 2 venceu <br>`;
    } else {
        var moves_container = document.getElementById('moves-text');
        moves_container.innerHTML += `Jogador 1 venceu <br>`;
    }
}

function startSingleplayer() {
    pokemon_container.style.display = "none";
    renderPokemonDropdownLists(); 
}

function playGame() {
    pokemon_container.style.display = "block";
    pokemon_menu.style.display = "none";

    pokemon[0] = document.getElementById('pokemon_names_dropdown1').value
    pokemon[1] = document.getElementById('pokemon_names_dropdown2').value

    renderPokemon(pokemon[0], 0);
    renderPokemon(pokemon[1], 1);

    disableButtons(1);
}
