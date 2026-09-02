import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import { loadConfig, watchCommands } from "./utils/watcher.js";
import { logError } from "./utils/logs.js";
import { parseCmd } from "./utils/parseCmd.js";
import { executeCmd } from "./utils/executeCmd.js";
import { connect } from "./utils/websockets.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: {
    parse: ["users"],
  },
});

client.commands = new Map();

const loadCommands = async () => {
  const files = await fs.readdir("./commands");
  const commandFiles = files.filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}?t=${Date.now()}`);
    client.commands.set(command.default.name, command.default);
  }
};

const listener = async (msg) => {
  if (msg.author.id !== "1464193879493574762") return;
  
  const parsed = await parseCmd(client, msg);
  if (!parsed) return;

  const { commandName, args } = parsed;

  await executeCmd(client, msg, commandName, args);
}

client.once("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", listener);
client.on("messageUpdate", (_, newMsg) => listener(newMsg));

process.on("uncaughtException", logError);
process.on("unhandledRejection", logError);

const start = async () => {
  await loadConfig();
  await loadCommands();
  watchCommands(client);
  connect();
  client.login(process.env.TOKEN);
};

start();
