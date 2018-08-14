import Bot from './bot.js';
import eventDispatcher from './eventDispatcher';

export const newClient = (client) => {
  return new Promise((resolve) => {
    console.log('\x1b[42m Creating client... \x1b[0m');
    client.bot = Bot;
    resolve(client);
  });
}

export const buildClient = (client) => {
  return new Promise((resolve) => {
    console.log('\x1b[43m Building client... \x1b[0m');
    eventDispatcher(client.bot);
    resolve(client);
  });
}

export const startClient = (client) => {
  return new Promise((resolve) => {
    console.log('\x1b[43m Starting client... \x1b[0m');
    client.bot.login(process.env.DISCORD_TOKEN)
    .then(() => {
      Bot.identity = new RegExp('<@' + Bot.user.id + '>',"gi");
      resolve(client);
    });
  });
}

export const destroyClient = (client) => {
  return new Promise((resolve) => {
    if(client.bot){
      console.log('\x1b[41m Destroying client... \x1b[0m');
      client.bot.removeAllListeners();
      client.bot.destroy()
      .then(() => {
        delete client.bot;
        console.log('\x1b[41m Client destroyed! \x1b[0m');
        resolve(client);
      });
    } else {
      resolve(client);
    }
  });
}
