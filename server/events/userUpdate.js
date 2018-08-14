export default (response) => {

//   //  Extract response data, default to system channel if no config
//   let guild = response.guild;
//
// //  I should make helper functions to get roles by minimum permissions
//   let role = guild.roles.find('name', 'Lead Trainer');
//   let channel = guild.channels.find('name', 'welcome-lobby');
//
//   let message = `Welcome to **${response.guild.name}**, <@${response.user.id}>!
//   We like to keep this server to Mystic players only!
//
//   Screenshot of your name, buddy, and level and post it here to gain access to chat.
//   If you need help, contact a ${role}!`;
//
//   //  Message dispatcher time
//   channel.send(message);
  console.log(`\n\x1b[42mSome User Updated: ${response} \x1b[0m\n`);
}
