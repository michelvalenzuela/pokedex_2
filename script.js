console.log('inicio...');

$(document).ready(function () {
    console.log('traer pokemones');

    const urlPokemons = 'https://pokeapi.co/api/v2/pokemon/';
    console.log('URL => ' + urlPokemons);

    getPokemons(urlPokemons);

    $('#getMorePokemons').click(function () {
        const urlNext = $(this).attr('nextPageUrl');
        getPokemons(urlNext);
    });
});

const getPhoto = (url, name) => {
    
    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            $(`#img_${name}`).attr(
                'src', 
                data.sprites.other.dream_world.front_default
            );
        });
};

const getPokemons = (url) => {
    console.log('obteniendo pokemones desde ' + url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            const pokemons = data.results;
            const urlMorePokemons = data.next;

            $('#getMorePokemons').attr('nextPageUrl', urlMorePokemons);
            pokemons.forEach(function (pokemon) {
                showPokemon(pokemon);
            });

            $('.btnGetDataPokemon').click(function () {
                const urlPokemon = $(this).attr('data-url-pokemon');
                getPokemonData(urlPokemon);
            });
        });

};

const getPokemonData = (url) => {
    console.log('obteniendo datos de ' + url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            $('#modalPokemonLabel').text(data.name);
            $('#pokemonType').text('');
            $('#pokemonGenerations').text('');
            $('#pokemonAbilities').text('');
            $('#pokemonMoves').text('');

            data.types.forEach(function (type) {
                $('#pokemonType').append(`
                <li class="">${type.type.name} <button type="button" class="btn btn-secondary btn-sm btnDamageRelation mb-2 ml-3" data-url-damage="${type.type.url}">Ver relaciones de daño</button></li>
                `);
            });

            $('.btnDamageRelation').click(function () {
                const urlDamage = $(this).attr('data-url-damage');
                getDamage(urlDamage);
            });

            data.game_indices.forEach(function (generation) {
                $('#pokemonGenerations').append(`<li class="">${generation.version.name}</li>`);
            });


            data.abilities.forEach(function (ability) {
                $('#pokemonAbilities').append(`<li class="">${ability.ability.name} <button type="button" class="btn btn-success btn-sm btnPokemonAbility mb-2 ml-3" data-url-other-pokemons ="${ability.ability.url}">También tienen esta habilidad</button></li>`);
            });

            $('.btnPokemonAbility').click(function () {
                const urlAbility = $(this).attr('data-url-other-pokemons');
                getAbilities(urlAbility);
            });
            

            for (let i = 0; i < 5; i++){
                $('#pokemonMoves').append(
                    `<li class="">${data.moves[i].move.name}</li>`
                );
            }

            $('#modalPokemon').modal('show');

        });

    
};

const getDamage = (url) => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => { 

            $('#modalPokemonDamageRelationLabel').text(data.name);
            $('#double_damage_from').text('');
            $('#double_damage_to').text('');
            $('#half_damage_from').text('');
            $('#half_damage_to').text('');
            $('#no_damage_from').text('');
            $('#no_damage_to').text('');

            data.damage_relations.double_damage_from.forEach(function(damage) {
                $('#double_damage_from').append(`<li class="">${damage.name}</li>`);
            });

            data.damage_relations.double_damage_to.forEach(function(damage) {
                $('#double_damage_to').append(`<li class="">${damage.name}</li>`);
            });

            data.damage_relations.half_damage_from.forEach(function(damage) {
                $('#half_damage_from').append(`<li class="">${damage.name}</li>`);
            });

            data.damage_relations.half_damage_to.forEach(function(damage) {
                $('#half_damage_to').append(`<li class="">${damage.name}</li>`);
            });

            data.damage_relations.no_damage_from.forEach(function(damage) {
                $('#no_damage_from').append(`<li class="">${damage.name}</li>`);
            });

            data.damage_relations.no_damage_to.forEach(function(damage) {
                $('#no_damage_to').append(`<li class="">${damage.name}</li>`);
            });
    
            $('#modalPokemonDamageRelation').modal('show');
        });

};

const getAbilities = (url) => {
    fetch(url)
        .then((response) => response.json())
        .then((data) => { 
            $('#modalPokemonAbilityLabel').text(data.name);
            $('#other-pokemons').text('');

            data.pokemon.forEach(function(p) {
                $('#other-pokemons').append(`<li class="">${p.pokemon.name}</li>`);
            })

            $('#modalPokemonAbility').modal('show');
        });
};

const showPokemon = (pokemon) => {
    $('#pokedex').append(`
    <div class="card col-lg-3 ml-5">
        <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <img src="" id="img_${pokemon.name}" class="w-100">
            <button class="btn btnGetDataPokemon mt-3" data-url-pokemon="${pokemon.url}">¡Quiero saber más de este Pokémon! </button>
        </div>
    </div>
    `);
getPhoto(pokemon.url, pokemon.name);
}
