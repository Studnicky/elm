//  Triggers for server related events
import ready from './events/ready';
import error from './events/error';
import warn from './events/warn';
import debug from './events/debug';
import disconnect from './events/disconnect';
import reconnecting from './events/reconnecting';

//  Triggers fired by guild member changes
import guildMemberAdd from './events/guildMemberAdd';
import guildMemberUpdate from './events/guildMemberUpdate';

//  Triggers fired from text entry -> controls all commands
import message from './events/message';

//  User message interaction
import messageUpdate from './events/messageUpdate';
import messageDelete from './events/messageDelete';
import messageReactionAdd from './events/messageReactionAdd';

export default (Bot) => {
    Bot.on('ready', ready);
    Bot.on('disconnect', disconnect);
    Bot.on('reconnecting', reconnecting);
    Bot.on('error', error);
    Bot.on('guildMemberAdd', guildMemberAdd);
    Bot.on('guildMemberUpdate', guildMemberUpdate);
    Bot.on('message', message);
    Bot.on('messageUpdate', messageUpdate);
    Bot.on('messageDelete', messageDelete);
    Bot.on('messageReactionAdd', messageReactionAdd);
}

// (node:3092) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 guildMemberUpdate listeners added. Use emitter.setMaxListeners() to increase limit
