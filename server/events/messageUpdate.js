import Bot from '../bot.js';
import * as command from '../commandDispatcher';

export default (beforeMessage, afterMessage) => {
  return new Promise((resolve, reject) => {
    if (afterMessage.author.bot === true) {reject()}
    if (afterMessage.attachments.size !== 0) {
      //  If there's attachments, dispatch to handle them...
      console.log(`\x1b[45mSaw: \x1b[0m ${afterMessage.attachments.size} attachments`);
    }
    if (Bot.identity.test(afterMessage.content) === true) {
      //  If someone talked to you, see if there's a command...
      console.log(`\x1b[44mDispatching: \x1b[0m ${afterMessage.content}`);
      afterMessage.channel.startTyping();
      command.dispatch(afterMessage)
      .then((output) => {
        afterMessage.channel.stopTyping();
        afterMessage.reply(output);
        resolve();
      })
      .catch((error) => {
        afterMessage.channel.stopTyping();
        afterMessage.reply(error);
        reject();
      })
    } else {
      reject();
    }
  })
  .catch((err) => { /* ignore */ });
}
