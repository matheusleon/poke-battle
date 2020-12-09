function clearContainers() {
    var pokemon_menu = document.querySelector('#pokemon-menu');
    pokemon_menu.innerHTML = "";
    var pokemon_container = document.querySelector('#pokemon-container');
    //pokemon_container.innerHTML = "";
}

function capitalizeFirstvarter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemonDropdownLists() {
    //clearContainers();

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

function renderPokemonImage(pokemon_name, container_div) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    var poke_img_container = document.createElement('div')
    poke_img_container.classList.add('image')

    fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        var poke_img = document.createElement('img')
        poke_img.srcset = `https://pokeres.bastionbot.org/images/pokemon/${pokemon_data.id}.png`
        poke_img_container.append(poke_img)

        container_div.append(poke_img_container);
    })
}

async function getPokemonMoves(pokemon_name) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    var moves = []
    var counter = 0;

    await fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        pokemon_data.moves.forEach(element => {
            //console.log(element)
            if (moves.length < 4 && element.version_group_details[0].move_learn_method.name == 'level-up') {
                moves.push(element.move.name)
                //console.log('aq ' + [element.move.name, element.move.url])
                counter++;
            }
        });
    })
    return moves;
}

function renderPokemonMoves(pokemon_name, container_div, player_id) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    
    getPokemonMoves(pokemon_name).then(moves => {
        counter = 0
        for (var i = 0; i < 4; i++) {
            var button_name = `player${player_id}-move${i}`;
            var poke_move = document.getElementById(button_name)
            poke_move.innerHTML = moves[i];

            // var poke_move = document.createElement("BUTTON");
            // poke_move.innerHTML = move;
            // container_div.append(poke_move);

        }
    });
}


function renderPokemon(pokemon_name, all_pokemon_container, player_id) {
    var poke_container = document.createElement("div")
    //poke_container.classList.add('ui', 'card');
    renderPokemonImage(pokemon_name, poke_container);
    renderPokemonMoves(pokemon_name, all_pokemon_container, player_id);

    var pokeName = document.createElement('h4') 
    pokeName.innerText = pokemon_name

    poke_container.append(pokeName);
    all_pokemon_container.appendChild(poke_container);    
}

function playGame() {
    var pokemon1 = document.getElementById('pokemon_names_dropdown1').value
    var pokemon2 = document.getElementById('pokemon_names_dropdown2').value
    //var pokemon1 = 'charmander';
    //var pokemon2 = 'squirtle';

    var all_pokemon_container = document.querySelector('#pokemon-container');

    renderPokemon(pokemon1, all_pokemon_container, 0);
    renderPokemon(pokemon2, all_pokemon_container, 0);
    clearContainers();
}
