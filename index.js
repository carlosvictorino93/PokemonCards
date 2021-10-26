const pokemons = [{ name: 'zapdos', color: 'yellow' }, { name: 'moltres', color: 'red' }, { name: 'articuno', color: 'blue' }];
const statsName = ['life', 'attack', 'defense', 'speed'];
let pokemonsInfo;

btn = document.querySelector("button");
btn.addEventListener("click", () => {
    const select = document.querySelector("select");
    if (select.value !== null) {
        const maxValue = Math.max.apply(Math, pokemonsInfo.map((p) => p[select.value]));
        pokemonsInfo.map(p => {
            const color = (p[select.value] === maxValue) ? p.color : 'grey';
            const div = document.getElementsByName(p.name)[0];
            div.classList.remove(p.color, 'grey');
            div.classList.add(color); 
        });
    }
})

const searchPokemon = async (pokemonName, color) => {
    pokemonName = pokemonName.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const dataAPI = await fetch(url);
    const data = await dataAPI.json();
    const stats = data.stats.reduce((acc, { base_stat, stat }) => {
        const stateName = stat.name === 'hp' ? 'life' : stat.name;
        if (statsName.includes(stateName)) acc[stateName] = base_stat;
        return acc;
    }, {});
    stats.name = pokemonName;
    stats.color = color;
    return stats;
};
const getPokemonsCategoriesList = async (arr) => {
    const resultList = await Promise.resolve(Promise.all(arr.map(async ({ name, color }) => await searchPokemon(name, color))));
    return resultList;
}
const buildCards = async () => {
    pokemonsInfo = await getPokemonsCategoriesList(pokemons);
    pokemonsInfo.forEach((pInf) => {
        const section = document.getElementsByTagName("section")[0];
        const tag = document.createElement('div');
        tag.setAttribute('name', pInf.name);
        tag.classList.add(pInf.color);
        const table = getTable(pInf);
        section.appendChild(tag).innerHTML = `<img src="./images/${pInf.name}.png" alt="">${table}`;
    });
    statsName.forEach(s => {
        const select = document.getElementsByTagName("select")[0];
        const tag = document.createElement('option');
        tag.setAttribute('value', s);
        select.appendChild(tag).innerText = s.toUpperCase();
    });
} 
const getTable = (obj) => {
    const rows = statsName.map(s => `<tr><td>${s.toUpperCase()}</td><td>${obj[s]}</td></tr>`);
    return `<table>${rows.join('')}</table>`;
}
buildCards();
