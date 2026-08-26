import stripAnsi from "strip-ansi";
import { logError } from "../utils/logs.js";
import { dm, reply } from "../utils/embeds.js";
import {
  bot,
  wsState,
  createShell,
  deleteShell,
  executeCommand,
} from "../utils/websockets.js";

export default {
  name: "root",
  desc: "Connects to my vps to execute commands",
  execute(client, msg, args) {
    const prefix = ".";

    if ((wsState === "reconnecting"))
      return reply(msg, {
        desc: "Websocket is not connected",
      });

    createShell();

    const onAuthorise = async (content) => {
      await dm(msg, msg.author, {
        desc: content,
      });
    };

    const onError = (content) => logError(content);

    const onShellCreateOrDelete = (content) => {
      msg.channel.send(content);
    };

    const onCommandExecute = async (content) => {
      const clean = stripAnsi(content);

      if (!clean.trim()) return;

      await msg.channel.send(clean);
    };

    bot.on("authorise", onAuthorise);

    bot.on("error", onError);

    bot.on("shellCreate", onShellCreateOrDelete);

    bot.on("shellDelete", onShellCreateOrDelete);

    bot.on("commandExecute", onCommandExecute);

    const listener = async (message) => {
      if (message.author.id !== msg.author.id) return;
      if (message.content.startsWith(prefix)) return;

      const cmd = message.content.trim();

      if (cmd === "exit") {
        deleteShell();
        client.off("messageCreate", listener);
        bot.off("authorise", onAuthorise);
        bot.off("error", onError);
        bot.off("shellCreate", onShellCreateOrDelete);
        bot.off("shellDelete", onShellCreateOrDelete);
        bot.off("commandExecute", onCommandExecute);
        return;
      }

      executeCommand(cmd);
    };

    client.on("messageCreate", listener);
  },
};
