import Discord from 'discord.js';
import fetch from 'node-fetch';

import Bot from '../bot.js';
import { toCap } from '../utils';

import knownTypes from '../config/knownTypes';

export const aliases = ['type', 'types'];

const getKeywords = (message) => {
  let operation = `getKeywords`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let input = message.content.trim().toLowerCase().split(/ +/g);
    let foundTypes = [];
    for (const val of Object.keys(knownTypes)){
      for (const i in input){
        if (new RegExp(val,"g").test(input[i])){
          foundTypes.push(input[i]);
        }
      }
    }
    if(foundTypes.length === 0){
      reject(new Error(`you did not provide a known Pokemon type.`));
    } else if (foundTypes.length > 2){
      reject(new Error(`a Pokemon may only have one or two types.`));
    } else {
      resolve(foundTypes)
    }
  });
}

const fetchType = (type) => {
  let operation = `fetchType`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  let URI = `http://pokeapi.co/api/v2/type/${type}`;
  return new Promise((resolve, reject) => {
    fetch(URI, {
      method: 'GET'
    })
    .then((result) => {
      if(result.ok && result.status === 200){
        result.json().then(resolve);
      } else if (result.status === 404){
        reject(new Error(`I was unable to locate type data for ${type}`));
      } else {
        reject(new Error(`the pokeAPI service appears to be down.`));
      }
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export const fetchTypes = (types) => {
  let operation = `fetchTypes`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return Promise.all(types.map((type) => fetchType(type)));
}

export const getTypeSpread = (types) => {
  let operation = `getTypeSpread`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    //  Create types spread
    let pkgoTypeSpread = {
        "resistant to": [],
        "vulnerable to": [],
      };
    //  Assign initial array values
    types.forEach((type) => {
      pkgoTypeSpread[`${type.name} attacks effective against`] = [];
      pkgoTypeSpread[`${type.name} attacks ineffective against`] = [];
      type.damage_relations.double_damage_to.forEach((relationType) => {
        pkgoTypeSpread[`${type.name} attacks effective against`].push(relationType.name);
      });
      [...type.damage_relations.half_damage_to, ...type.damage_relations.no_damage_to].forEach((relationType) => {
        pkgoTypeSpread[`${type.name} attacks ineffective against`].push(relationType.name);
      });
      [...type.damage_relations.half_damage_from, ...type.damage_relations.no_damage_from].forEach((relationType) => {
        pkgoTypeSpread["resistant to"].push(relationType.name);
      });
      type.damage_relations.double_damage_from.forEach((relationType) => {
        pkgoTypeSpread["vulnerable to"].push(relationType.name);
      });
    });
    //  If it's in both resistant and vulnerable, it's not in either.
    [...pkgoTypeSpread["resistant to"], ...pkgoTypeSpread["vulnerable to"]].forEach((typeName) => {
        let resists = pkgoTypeSpread["resistant to"].indexOf(typeName);
        let vulnerable = pkgoTypeSpread["vulnerable to"].indexOf(typeName)
        if (resists > -1 && vulnerable > -1) {
        pkgoTypeSpread["vulnerable to"] = pkgoTypeSpread["vulnerable to"].filter((type) => {
          return type != typeName;
        });
        pkgoTypeSpread["resistant to"] = pkgoTypeSpread["resistant to"].filter((type) => {
          return type != typeName;
        });
      }
    });
    //  Indicate doubles better
    pkgoTypeSpread["vulnerable to"].forEach((typeName, index) => {
      //  If the value is found after it's initial location...
      if (pkgoTypeSpread["vulnerable to"].indexOf(typeName, index + 1) > -1) {
        pkgoTypeSpread["vulnerable to"] = pkgoTypeSpread["vulnerable to"].filter((type) => {
          return type != typeName;
        });
        pkgoTypeSpread["vulnerable to"].push(`_**2x ${toCap(typeName)}**_`);
      }
    });
    pkgoTypeSpread["resistant to"].forEach((typeName, index) => {
      //  If the value is found after it's initial location...
      if (pkgoTypeSpread["resistant to"].indexOf(typeName, index + 1) > -1) {
        pkgoTypeSpread["resistant to"] = pkgoTypeSpread["resistant to"].filter((type) => {
          return type != typeName;
        });
        pkgoTypeSpread["resistant to"].push(`_**2x ${toCap(typeName)}**_`);
      }
    });
    //  Return it all
    resolve({"types": types, "pkgoTypeSpread": pkgoTypeSpread});
  });
}

const getStrings = (name) => {
  // let emoji = Bot.guilds.get(message.guild.id).emojis.find('name', name + "type");
  // return `${emoji} ${text}`;
  let text = toCap(name);
  return `${text}`;
}

const formatTypes = ({types, pkgoTypeSpread}) => {
  let operation = `formatTypes`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    // let emoji = Bot.guilds.get(message.guild.id).emojis.find('name', type.name + "type");
    const embed = new Discord.RichEmbed()
    // .setTitle(`Type info for: ${types.map((type) => getStrings(type.name)).join(",  ")}`)
    .setTitle(`Type info for: ${types.map((type) => getStrings(type.name)).join(" & ")}`)
    .setColor(knownTypes[types[0]['name']]['color'])
    .setFooter("Provided by PokeAPI"/*, optional icon */)
    .setTimestamp();
    for (const key in pkgoTypeSpread){
      let affectedTypes = pkgoTypeSpread[key];
        if (affectedTypes.length > 0){
          embed.addField(`${toCap(key)}: `, `${affectedTypes.map((name) => getStrings(name)).join(",  ")}`);
        }
    }
    resolve({embed});
  });
};

const lookupType = {
  operands: ['fetch', 'get', 'info', 'show', 'lookup', 'entry'],
  description: "Show strengths and weaknesses for provided types.",
  example: "types info dark fire",
  minRole: null,
  operation: (message) => {
    return new Promise((resolve, reject) => {
      getKeywords(message)
      .then(fetchTypes)
      .then(getTypeSpread)
      .then(formatTypes)
      .then(resolve)
      .catch(reject)
    });
  }
}


export const operations = {
  'type': lookupType
}
