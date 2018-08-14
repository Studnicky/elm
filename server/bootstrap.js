let Client = require('./client.js');

const buildClient = () => {
  return Client.destroyClient(client)
  .then(Client.newClient)
  .then(Client.buildClient)
  .then(Client.startClient);
}

let client = {};
buildClient();

if (module.hot) {
  module.hot.accept("./client", () => {
    Client = require('./client.js');
    buildClient();
  });
}
