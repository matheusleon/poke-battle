function clearContainers() {
    let pokemon_menu = document.querySelector('#pokemon-menu');
    pokemon_menu = "";
    let pokemon_container = document.querySelector('#pokemon-container');
    pokemon_container = "";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemonDropdownLists() {
    clearContainers();

    fetchKantoPokemon().then(allPokemons => {  
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown1');
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown2');
    });
} 

function renderPokemonDropdownList(allPokemons, dropdownlist_name) {
    let dropdown = document.getElementById(dropdownlist_name);
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose your Pokemon';
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    for (var i = 0; i < allPokemons.length; i++) {
        let option = document.createElement('option');
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

function renderPokemonImage(pokemon_name, container_div) {
    pokemon_info_url = 'https://pokeapi.co/api/v2/pokemon/' + pokemon_name;
    let poke_img_container = document.createElement('div')
    poke_img_container.classList.add('image')

    fetch(pokemon_info_url)
    .then(results => results.json())
    .then(pokemon_data => {
        // console.log(pokemon_data.moves[0])
        // console.log(pokemon_data.id);
        let poke_img = document.createElement('img')
        poke_img.srcset = `https://pokeres.bastionbot.org/images/pokemon/${pokemon_data.id}.png`
        
        poke_img_container.append(poke_img, [pokemon_data.moves[0].move.name, pokemon_data.moves[1].move.name]);
        container_div.append(poke_img_container);
    })
}


function renderPokemon(pokemon_name, all_pokemon_container) {
    let poke_container = document.createElement("div")
    poke_container.classList.add('ui', 'card');
    renderPokemonImage(pokemon_name, poke_container);

    let pokeName = document.createElement('h4') 
    pokeName.innerText = pokemon_name

    poke_container.append(pokeName);
    all_pokemon_container.appendChild(poke_container);    
}

function playGame() {
    clearContainers();
    
    var pokemon1 = document.getElementById('pokemon_names_dropdown1').value
    var pokemon2 = document.getElementById('pokemon_names_dropdown2').value

    // console.log(pokemon1 + ' e ' + pokemon2);

    let all_pokemon_container = document.querySelector('#pokemon-container');

    renderPokemon(pokemon1, all_pokemon_container);
    renderPokemon(pokemon2, all_pokemon_container);
}
