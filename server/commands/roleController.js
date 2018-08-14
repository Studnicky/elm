// import Discord from 'discord.js';
import Bot from '../bot.js';
import { toLow } from '../utils';

export const aliases = ['role', 'roles', 'group', 'groups', 'team', 'teams', 'location', 'locations'];

const availableRoles = (guildId) => {
  let operation = `availableRoles`;
  console.log(`\x1b[45m`, operation, `\x1b[0m`);
  return new Promise((resolve/*, reject*/) => {
    // let doNotReturn = ['@everyone', 'Muted', 'Dyno', 'Elm', 'Trainer'];
    // let shiftThese = ['rares', 'Squirtle Squad'];
    // let bot_role = Bot.guilds.get(guildId).roles.find('name', 'Elm');
    let roles = Bot.guilds.get(guildId).roles.array()
    // .filter((role) => {
    //   if (doNotReturn.indexOf(role.name) === -1 && role.comparePositionTo(bot_role) < 0){
    //     return role;
    //   }
    // })
    .sort((a,b) => {
      return ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
    });
    // shiftThese.forEach((name) => {
    //   roles.forEach((role, i) => {
    //     if(role.name === name){
    //       roles.splice(0, 0, roles.splice(i, 1)[0]);
    //     }
    //   })
    // });
    resolve(roles);
  });
}

const listRoles = {
  operands: ['list', 'show'],
  description: "Show list of current roles.",
  example: "list roles",
  minRole: null,
  operation: (message) => {
    let operation = `listRoles`;
    console.log(`\x1b[45m`, operation, `\x1b[0m`);
    return new Promise((resolve/*, reject*/) => {
      let roleNames = [];
      availableRoles(message.guild.id)
      .then((roles) => {
        roles.forEach((role) => {
          roleNames.push(role.name);
        });
        resolve(toLow(`Listing available roles:\n${roleNames.join('\n')}`));
      })
    });
  }
}

const getRoles = {
  operands: ['my', 'get'],
  description: "Show your current roles.",
  example: "get roles",
  minRole: null,
  operation: (message) => {
    let operation = `getRoles`;
    console.log(`\x1b[45m`, operation, `\x1b[0m`);
    return new Promise((resolve/*, reject*/) => {
      let roleNames = [];
      availableRoles(message.guild.id)
      .then((roles) => {
        roles.forEach((role) => {
          if (message.guild.member(message.author).roles.has(role.id)) {
            roleNames.push(role.name);
          }
        });
        resolve(toLow(`Your roles are:\n ${roleNames.join(', ')}`));
      })
      .catch((err) => {
        console.log("caught", err);
      });
    })
  }
}

const addRoles = {
  operands: ['set', 'add', 'join'],
  description: "Add yourself to a role.",
  example: "add role Downtown",
  minRole: null,
  operation: (message) => {
    let operation = `addRoles`;
    console.log(`\x1b[45m`, operation, `\x1b[0m`);
    return new Promise((resolve/*, reject*/) => {
      let alreadyRoleAdd = [], successRoleAdd = [], failedRoleAdd = [];
      availableRoles(message.guild.id)
      .then((roles) => {
        Promise.all(roles.filter((role) => {
          if (message.content.toLowerCase().includes(role.name.toLowerCase())) {
            return role;
          }
        })
        .map((role) => {
          return new Promise((resolve/*, reject*/) => {
            if (message.guild.member(message.author).roles.has(role.id)) {
              resolve(alreadyRoleAdd.push(role.name));
            } else {
              message.guild.member(message.author).addRole(role)
              .then(() => {
                resolve(successRoleAdd.push(role.name));
              })
              .catch((err) => {
                console.log(err);
                resolve(failedRoleAdd.push(role.name));
              });
            }
          })
        }))
        .then(() => {
          let reply = '';
          if(alreadyRoleAdd.length > 0){
            reply += `You already joined: ${alreadyRoleAdd.join(', ')}\n`;
          }
          if(successRoleAdd.length > 0){
            reply += `You were added to: ${successRoleAdd.join(', ')}\n`;
          }
          if(failedRoleAdd.length > 0){
            reply += `Failed to add to: ${failedRoleAdd.join(', ')}\nI may not have the proper permissions to do that.`;
          }
          resolve(toLow(reply));
        })
        .catch((err) => {
          console.log("caught", err);
        });
      })
    });
  }
}


const deleteRoles = {
  operands: ['remove', 'delete', 'leave'],
  description: "Remove a role from yourself.",
  example: "remove role Downtown",
  minRole: null,
  operation: (message) => {
    let operation = `deleteRoles`;
    console.log(`\x1b[45m`, operation, `\x1b[0m`);
    return new Promise((resolve/*, reject*/) => {
      let noRoleDelete = [], successRoleDelete = [], failedRoleDelete = [];
      availableRoles(message.guild.id)
      .then((roles) => {
        Promise.all(roles.filter((role) => {
          if (message.content.toLowerCase().includes(role.name.toLowerCase())) {
            return role;
          }
        })
        .map((role) => {
          return new Promise((resolve/*, reject*/) => {
            if (!message.guild.member(message.author).roles.has(role.id)) {
              resolve(noRoleDelete.push(role.name));
            } else {
              message.guild.member(message.author).removeRole(role)
              .then(() => {
                resolve(successRoleDelete.push(role.name));
              })
              .catch((err) => {
                console.log(err);
                resolve(failedRoleDelete.push(role.name));
              });
            }
          })
        }))
        .then(() => {
          let reply = '';
          if(noRoleDelete.length > 0){
            reply += `You aren't in: ${noRoleDelete.join(', ')}\n`;
          }
          if(successRoleDelete.length > 0){
            reply += `Removed you from: ${successRoleDelete.join(', ')}\n`;
          }
          if(failedRoleDelete.length > 0){
            reply += `Failed to remove from: ${failedRoleDelete.join(', ')}\n`;
          }
          resolve(toLow(reply));
        })
        .catch((err) => {
          console.log("caught", err);
        });
      })
    });
  }
}

export const operations = {
  'list': listRoles,
  'get': getRoles,
  'add': addRoles,
  'remove': deleteRoles
}
