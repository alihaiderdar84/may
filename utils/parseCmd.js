import { getConfig } from "./watcher.js";
const parseCmd = async (client, msg) => {
  const prefix = getConfig().prefixes.find((p) =>
    msg.content.startsWith(`${p} `),
  );

  const referenced = msg.reference?.messageId ? await msg.fetchReference() : null;
   const reference = referenced?.author.id === client.user.id;
  if (!prefix && !reference) return;

  if (prefix) msg.content.slice(prefix.length);

  const [commandName, ...args] = msg.content.trim().split(/\s+/);

  return {
    prefix,
    commandName,
    args,
  };
};

export { parseCmd };
