import { logError } from "./logs.js";
import { reply } from "./embeds.js";

const executeCmd = async (client, msg, commandName, args) => {
  let command = client.commands.get(commandName);

  if (!command) {
    command = client.commands.get("ai");
    args.unshift(commandName);
  }

  try {
    await command.execute(client, msg, args);
  } catch (err) {
    logError(`[${command.name}] ${err}`);

    reply(msg, { type: "error", desc: "Something went wrong" });
  }
};

export { executeCmd };
