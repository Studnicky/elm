import Bot from '../bot.js';
import * as command from '../commandDispatcher';
import * as file from '../fileDispatcher';

import channelConfig from '../config/channelConfig';
import usersConfig from '../config/usersConfig';

export default (message) => {
  return new Promise((resolve, reject) => {

    if (message.author.bot) {
      reject(new Error(`I don't talk to bots`));
    }

    if (usersConfig.banned.includes(message.author.id)) {
      reject(new Error(`I don't talk to banned users.`));
    }

    if (message.author.id === Bot.users.find('username', 'magus66').id) {
      let emoji = Bot.guilds.get(message.guild.id).emojis.find('name', "Trubbish");
      if(emoji) { message.react(emoji); }
      reject(new Error(`I don't talk to trash.`));
    } else {

      if (message.attachments.size !== 0  && channelConfig.fileChannels.includes(message.channel.name)) {
        //  If there's attachments, dispatch to handle them...
        console.log(`\x1b[45m Attachments: \x1b[0m ${message.attachments.size}`);
          message.channel.startTyping();
          file.saveFileToUserDirectory(message)
          .then((output) => {
            if(output){ message.reply(output); }
            message.react('✅');
            message.channel.stopTyping();
            resolve();
          })
          .catch((error) => {
            if(error){ message.reply(error.message); }
            message.react('⚠');
            message.channel.stopTyping();
            reject();
          })
        }

        if (Bot.identity.test(message.content) === true) {
          //  If someone talked to you, see if there's a command...
          console.log(`\x1b[44m Dispatching: \x1b[0m ${message.content}`);
            message.channel.startTyping();
            command.dispatch(message)
            .then((output) => {
              message.channel.stopTyping();
              if(output){
                message.reply(output);
              }
              resolve();
            })
            .catch((error) => {
              message.channel.stopTyping();
              if(error){
                console.log(error);
                message.reply(error.message);
              }
              reject();
            });
          } else {
            reject(/* They weren't talking to me */);
          }

        }

      })
      .catch((err) => { /* ignore */ });
    }
