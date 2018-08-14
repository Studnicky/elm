import Discord from 'discord.js';
import fetch from 'node-fetch';

import Bot from '../bot.js';
import { toCap } from '../utils';
import { fetchTypes, getTypeSpread } from './typeController';

import knownTypes from '../config/knownTypes';

export const aliases = ['pokémon', 'poké', 'pokemon', 'pokédex', 'pokedex', 'poke', 'dex'];

const getKeywords = (message, keywords) => {
  let operation = `getKeywords`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let input = message.content.trim().toLowerCase().split(/ +/g);
    for (const val of [...aliases, ...keywords, Bot.identity]){
      for (const i in input){
        if (new RegExp(val,"g").test(input[i])) {
          input.splice(i, 1);
        }
      }
    }
    //  This could be better, but shit, there's a lot of pokemon
    let pokemon = input[0];
    if(!pokemon){
      reject(new Error(`You must provide a Pokémon name or Pokédex number!`));
    } else {
      resolve(pokemon);
    }
  });
};

const fetchPokemon = (pokemon) => {


      if(pokemon === 'best') {
        pokemon = 'shuckle';
      }
      if(pokemon === 'worst' ){
        pokemon = 'gyarados';
      }
      if(pokemon === 'trash'){
        pokemon = 'MrBadger';
      }

  let operation = `fetchPokemon`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  let URI = `http://pokeapi.co/api/v2/pokemon/${pokemon}`;
  return new Promise((resolve, reject) => {
    fetch(URI, { method: 'GET' })
    .then((result) => {
      if(result.ok && result.status === 200){
        result.json().then(resolve);
      } else if (result.status === 404){
        reject(new Error(`I was unable to locate a pokédex entry for ${pokemon}`));
      } else {
        reject(new Error(`the pokéAPI service appears to be down.`));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
}

const fetchSpecies = (pokemon) => {
  let operation = `fetchSpecies`;

    if(pokemon === 'best') {
      pokemon = 'shuckle';
    }
    if(pokemon === 'trash' || pokemon === 'worst' ){
      pokemon = 'gyarados';
    }
    if(pokemon === 'trash'){
      pokemon = 'MrBadger';
    }

  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  let URI = `http://pokeapi.co/api/v2/pokemon-species/${pokemon}`;
  return new Promise((resolve, reject) => {
    fetch(URI, {
      method: 'GET'
    })
    .then((result) => {
      if(result.ok && result.status === 200){
        result.json().then(resolve);
      } else if (result.status === 404){
        reject(new Error(`I was unable to locate a pokédex entry for ${pokemon}`));
      } else {
        reject(new Error(`the pokeAPI service appears to be down.`));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
}

const fetchEvolutionChain = (species) => {
  let operation = `fetchEvolutionChain`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  let URI = species.evolution_chain.url;
  return new Promise((resolve, reject) => {
    fetch(URI, {
      method: 'GET'
    })
    .then((result) => {
      if(result.ok && result.status === 200){
        result.json().then((evolutionChain) => {
          resolve(evolutionChain);
        });
      } else if (result.status === 404){
        reject(new Error(`I was unable to locate a pokédex entry for ${species.name}`));
      } else {
        reject(new Error(`the pokeAPI service appears to be down.`));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
}

const getPKGOstats = (pokemon) => {
  let operation = `getPKGOstats`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {

    let atk = pokemon.stats.find((stat) => {
      return stat.stat.name === 'attack';
    });
    let spcatk = pokemon.stats.find((stat) => {
      return stat.stat.name === 'special-attack';
    });
    let speed = pokemon.stats.find((stat) => {
      return stat.stat.name === 'speed';
    });
    let def = pokemon.stats.find((stat) => {
      return stat.stat.name === 'defense';
    });
    let spcdef = pokemon.stats.find((stat) => {
      return stat.stat.name === 'special-defense';
    });
    let hp = pokemon.stats.find((stat) => {
      return stat.stat.name === 'hp';
    });

    let pkgoStats = {
      attack:  Math.round((1+((speed.base_stat-75)/500))*(2*(Math.max(atk.base_stat, spcatk.base_stat)*7/8)+(Math.min(atk.base_stat, spcatk.base_stat)*1/8))),
      defense: Math.round((1+((speed.base_stat-75)/500))*(2*(Math.max(def.base_stat, spcdef.base_stat)*7/8)+(Math.min(def.base_stat, spcdef.base_stat)*1/8))),
      stamina: Math.round(hp.base_stat*2)
    };
    resolve({"pokemon": pokemon, "pkgoStats": pkgoStats});
  });
};

const formatStats = ({pokemon, pkgoStats}) => {
  let operation = `formatStats`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let primaryType = pokemon.types.find((type) => { return type.slot === 1; });
    const embed = new Discord.RichEmbed()
    .setTitle(`Base stats info for: ${toCap(pokemon.name)}`)
    .setThumbnail(pokemon.sprites.front_default)
    .setColor(knownTypes[primaryType['type']['name']]['color'])
    .setFooter("Provided by PokeAPI"/*, optional icon */)
    .setTimestamp()
    let types = [];
    for (const type of pokemon.types) {
      // let emoji = Bot.guilds.get(message.guild.id).emojis.find('name', type.type.name + "type");
      // types.push(`${emoji} ${toCap(type.type.name)}`);
      types.push(`${toCap(type.type.name)}`);
    }
    let pluralTypes = types.length > 1 ? 's' : '';
    embed.addField(`Type${pluralTypes}:`, `${types.join(', ')}`, true);
    for (const stat in pkgoStats){
      embed.addField("Base " + stat + ":", pkgoStats[stat], true);
    }
    resolve({embed});
  });
};

const getEvolutions = (evolutionChain) => {
  let operation = `getEvolutions`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    //  Recursively record evolution names into arrays
    const getNextInChain = (key, currentLink, currentChain) => {
      //  Clone new array at current chain link
      let newchain = [...currentChain, currentLink['species']['name']];
      if (currentLink[key] && currentLink[key].length !== 0) {
        for (const nextLink of currentLink[key]) {
          getNextInChain(key, nextLink, newchain);  //  Not done traversing
        }
      } else {
        evolutions[key].push(newchain);
      }
    };
    //  Match up with API's keys to iterate
    let evolutions = {
      "evolves_from": [],
      "evolves_to": []
    };
    //  Kickoff recursive iterations to fill key:vals
    for (const key of Object.keys(evolutions)){
      getNextInChain(key, evolutionChain['chain'], []);
    }
    resolve(evolutions);
  });
};

const formatEvolutions = ([pokemon, evolutions]) => {
  let operation = `formatEvolutions`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let primaryType = pokemon.types.find((type) => { return type.slot === 1; });
    const embed = new Discord.RichEmbed()
    .setTitle(`Evolutions info for: ${toCap(pokemon.name)}`)
    .setThumbnail(pokemon.sprites.front_default)
    .setColor(knownTypes[primaryType['type']['name']]['color'])
    .setFooter("Provided by PokéAPI"/*, optional icon */)
    .setTimestamp();
    let families = {
      "evolution_families": [],
      "related_families" : []
    };
    //  Re-map the evolutions into family trees...
    Object.keys(evolutions).forEach((key) => {
        evolutions[key].forEach((chain) => {
          if(chain.length > 1) {
            let formattedChain = chain.map((name) => {
              if(name === pokemon.name) {
                return `_**${toCap(name)}**_`;
              } else {
                return toCap(name);
              }
            }).join(" →  ");
            if (!chain.includes(pokemon.name)) {
              families["related_families"].push(formattedChain);
            } else {
              families["evolution_families"].push(formattedChain);
            }
          }
        });
    });
    if ( families["related_families"].length === 0 && families["evolution_families"].length === 0 ) {
      embed.addField(`Nope!`, `${toCap(pokemon.name)} does not ever evolve.`);
    } else {
      //  Put them in the embed
      for (const key in families) {
        if(families[key].length > 0) {
          embed.addField(`${toCap(key).replace('_', ' ')}: `, `${families[key].join("\n")}`);
        }
      }
    }
    resolve({embed});
  });
};

const getStrings = (name) => {
  // let emoji = Bot.guilds.get(message.guild.id).emojis.find('name', name + "type");
  // return `${emoji} ${text}`;
  let text = toCap(name);
  return `${text}`;
}

const formatPokeTypes = ({pokemon, pkgoTypeSpread}) => {
  let operation = `formatStats`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let primaryType = pokemon.types.find((type) => { return type.slot === 1; });
    const embed = new Discord.RichEmbed()
    .setTitle(`Counters info for: ${toCap(pokemon.name)}`)
    .setThumbnail(pokemon.sprites.front_default)
    .setColor(knownTypes[primaryType['type']['name']]['color'])
    .setFooter("Provided by PokeAPI"/*, optional icon */)
    .setTimestamp()
    embed.addField(`${pokemon.types.length > 1 ? 'Types' : 'Type'}:`, `${pokemon.types.map((type) => getStrings(type.type.name)).join(",  ")}`);
    for (const key in pkgoTypeSpread){
      let affectedTypes = pkgoTypeSpread[key];
        if (affectedTypes.length > 0){
          embed.addField(`${toCap(key)}: `, `${affectedTypes.map((name) => getStrings(name)).join(",  ")}`);
        }
    }
    resolve({embed});
  });
};

const getEvolutionsChain = (dexEntry) => {
  return fetchSpecies(dexEntry)
  .then(fetchEvolutionChain)
  .then(getEvolutions)
};

const lookupStats = {
  operands: ['statistics', 'stats', 'stat'],
  description: "Show Pokémon Go base stats for a Pokémon.",
  example: "dex stats Houndoom-mega",
  minRole: null,
  operation: (message) => {
    return new Promise((resolve, reject) => {
      getKeywords(message, lookupStats.operands)
      .then(fetchPokemon)
      .then(getPKGOstats)
      .then(formatStats)
      .then(resolve)
      .catch(reject)
    });
  }
}

const lookupEvolutions = {
  operands: ['evolutions', 'evolves', 'evolve', 'family', 'fam'],
  description: "Show evolution family trees for a Pokémon.",
  example: "dex family houndoom",
  minRole: null,
  operation: (message) => {
    return new Promise((resolve, reject) => {
      getKeywords(message, lookupEvolutions.operands)
      .then((dexEntry) => {
        return Promise.all([fetchPokemon(dexEntry), getEvolutionsChain(dexEntry)])
      })
      .then(formatEvolutions)
      .then(resolve)
      .catch(reject)
    });
  }
}

const lookupCounters = {
  operands: ['counters', 'counter', 'types', 'type'],
  description: "Show type strengths and weaknesses for a Pokémon.",
  example: "dex counters houndour",
  minRole: null,
  operation: (message) => {
    return new Promise((resolve, reject) => {
      getKeywords(message, lookupCounters.operands)
      .then(fetchPokemon)
      .then((pokemon) => {
        let types = pokemon.types.map((type) => { return type.type.name; });
        return fetchTypes(types)
        .then(getTypeSpread)
        .then(({types, pkgoTypeSpread}) => {
          return {"pokemon": pokemon, "pkgoTypeSpread": pkgoTypeSpread};
        })
      })
      .then(formatPokeTypes)
      .then(resolve)
      .catch(reject)
    });
  }
}

export const operations = {
  'stats': lookupStats,
  'counters': lookupCounters,
  'evolutions': lookupEvolutions
}
