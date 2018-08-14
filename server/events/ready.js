import Bot from '../bot.js';
export default () => {
  console.log(`\x1b[42m Bot connected at:\x1b[0m ${new Date()}\n\x1b[42m Bot username:\x1b[0m ${Bot.user.username} \n\x1b[42m Bot ID:\x1b[0m ${Bot.user.id}`);
  Bot.user.setGame('Pokeymanz');
}
