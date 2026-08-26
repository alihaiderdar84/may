import { logError } from "./logs.js";
import { reply } from "./embeds.js";

const executeCmd = async (client, msg, commandName, args) => {
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(client, msg, args);
  } catch (err) {
    logError(`[${command.name}] ${err}`);

    reply(msg, { type: "error", desc: "Something went wrong" });
  }
};

export { executeCmd };
