function renderPokemon() {
    let allPokemonContainer = document.querySelector('#pokemon-container');
    allPokemonContainer = "";

    fetchKantoPokemon().then(allPokemons => {  
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown');
        renderPokemonDropdownList(allPokemons.results, 'pokemon_names_dropdown2');
    });
} 

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

renderPokemon();