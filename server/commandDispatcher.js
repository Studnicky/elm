import Bot from './bot.js';
import cleverbot from './cleverbot.js';
import * as roleController from './commands/roleController';
import * as pokemonController from './commands/pokemonController';
import * as typeController from './commands/typeController';
import * as helpController from './commands/helpController';
import { toLow } from './utils';

const commands = {
  'role': roleController,
  'pokemon': pokemonController,
  'type': typeController,
  'help': helpController
};

const drilldown = (inputArgs, collection, targetKey) => {
  let operation = `drilldown`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve/*, reject*/) => {
    resolve(Object.getOwnPropertyNames(collection)
    .filter((prop) => {
      for (const val of collection[prop][targetKey]) {
        for (const i in inputArgs) {
          if(new RegExp(val,"g").test(inputArgs[i])) {
            inputArgs.splice(i, 1);
            return(collection[prop]);
          }
        }
      }
    }));
  });
}

const hasValidCommand = (message) => {
  let operation = `hasValidCommand`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let input = message.content.replace(Bot.identity, '');
    let inputArgs = input.trim().toLowerCase().split(/ +/g);
    drilldown(inputArgs, commands, 'aliases')
    .then((controllers) => {
      if(!controllers || controllers.length === 0){
        let input = message.content.replace(Bot.identity, '');
        //  This maybe should invoke the help command instead
        reject(new Error(`"${input.trim()}" is not a valid command.
Try one of the following: ${Object.getOwnPropertyNames(commands).join(', ')}`));
      } else {
        //  They found some controllers!  Get reference to the first one.
        resolve({ 'message': message, 'controller': commands[controllers[0]] });
      }
    });
  });
}


const hasValidOperand = ({ message, controller }) => {
  let operation = `hasValidOperand`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve, reject) => {
    let input = message.content.replace(Bot.identity, '');
    let inputArgs = input.trim().toLowerCase().split(/ +/g);
    let operations = Object.keys(controller['operations']);
    if(operations.length === 1){
      //  If the command only has a single operation, use it.
      let operand = controller['operations'][Object.keys(controller['operations'])[0]];
      resolve({ 'message': message, 'operation': operand['operation'] });
    } else {
      drilldown(inputArgs, controller['operations'], 'operands')
      .then((operands) => {
        if(!operands || operands.length === 0) {
          //  Get the keywords for all the operations
          let operators = (Object.getOwnPropertyNames(controller['operations'])).reduce((all, operation) => {
            let operands = controller['operations'][operation]['operands'];
            return [...all, ...operands];
          }, []);
          reject(new Error(`"${controller.aliases[0]}" is a valid command, but "${input.trim()}" is not a valid operation.
Try one of the following operations: ${operators.join(', ')}`));
        } else {
          //  They found an operand!  Return reference to the first one.
          resolve({ 'message': message, 'operation': controller['operations'][operands[0]]['operation'] });
        }
      });
    }
  });
}


const hasPermissions = ({message, operation}) => {
  return new Promise((resolve, reject) => {
    let role = operation['minRole'] || null;
    if (role) {
      let role = Bot.guilds.get(message.guild.id).roles.find('name', operation['minRole']);
      if (role && !message.guild.member(message.author).roles.has(role.id)) { //  Is the user allowed?
        reject(`you aren't permitted to use that.`);
      } else {
        resolve({'message': message, "operation": operation});
      }
    } else {
      resolve({'message': message, "operation": operation});
    }
  });
}


export const dispatch = (message) => {
  return new Promise((resolve, reject) => {
    let operation = `dispatch`;
    hasValidCommand(message)
    .then(hasValidOperand)
    .then(hasPermissions)
    .then(({message, operation}) => {
      //  Little messy but hey
      return operation(message);
    })
    .then(resolve)
    .catch(reject)
    // .catch((error) => {
    //   cleverbot.query(input)
    //   .then((response) => {
    //     resolve(toLow(response.output));
    //   });
    // });
  });
}
