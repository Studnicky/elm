import Discord from 'discord.js';
import * as pokemonController from './pokemonController';
import * as typeController from './typeController';
import * as roleController from './roleController';
import { toCap } from '../utils';

export const aliases = ['help', 'halp'];

const fetchCommands = () => {
  let operation = `fetchCommands`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let helpList = {};
    for (const key of Object.keys(controllers)) {
      const controller = controllers[key];
      helpList[key] = {
        "aliases": controller['aliases'],
        "helpText" : Object.keys(controller['operations']).map((operation) => {
          return {
            "keywords": controller['operations'][operation]['operands'],
            "description": controller['operations'][operation]['description'],
            "example": controller['operations'][operation]['example'],
            "minimum role": controller['operations'][operation]['minRole']
          };
        })
      };
    }
    resolve(helpList);
  });
};

const formatHelp = (helpList) => {
  let operation = `formatHelp`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    const embed = new Discord.RichEmbed()
    .setTitle(`Help Information:`)
    .setColor(0x888984)
    .setFooter("You're welcome."/*, optional icon */)
    .setTimestamp();
    for (const key in helpList) {
      let controller = helpList[key];
      let helpTextResult = controller.helpText.map((operaton) => {
        return `\n_${operaton.description}_\n**Keywords:** ${operaton.keywords.join(", ")}\n_${operaton.example}_`;
      }).join("\n");
      embed.addField(`\n\n${toCap(key)} Controller: `, `**Aliases**: _${controller.aliases.join(", ")}_\n${helpTextResult}`);
    }
    resolve({embed});
  });
};

const getHelp = {
  operands: [],
  description: "Show bot help",
  example: "help",
  minRole: null,
  operation: (message) => {
    return new Promise((resolve, reject) => {
      fetchCommands()
      .then(formatHelp)
      .then(resolve)
      .catch(reject)
    });
  }
};

export const operations = {
  'getHelp': getHelp
}

const controllers = {
  'role': roleController,
  'pokemon': pokemonController,
  'type': typeController,
  'help': {'aliases': aliases, 'operations': operations}  //  It's not stupid if it works
};
