import { getConfig } from "./watcher.js";
const parseCmd = (msg) => {
  const prefix = getConfig().prefixes.find((p) => msg.content.startsWith(p));
  if (!prefix) return;

  const [commandName, ...args] = msg.content.slice(prefix.length).trim().split(/\s+/);

  return { commandName, args };
};

export { parseCmd };
