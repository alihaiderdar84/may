import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import { loadConfig, getConfig, watchCommands } from "./utils/watcher.js";
import { logError } from "./utils/logError.js";
import { reply } from "./utils/embeds.js";


const client = new Client({
	 intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent],
	 allowedMentions: {
		parse: ["users"]
	}});

client.commands = new Map();

const loadCommands = async () => {
	const files = await fs.readdir("./commands")
	const commandFiles = files.filter(f => f.endsWith(".js"));

	for (const file of commandFiles) {
		const command = await import(`./commands/${file}?t=${Date.now()}`);
		client.commands.set(command.default.name, command.default)
	}
}

client.once("clientReady", () => {
	console.log(`Logged in as ${client.user.tag}`)
});



client.on("messageCreate", msg => {
	if (msg.author.bot || msg.author.id !== "1464193879493574762") return;

	const prefix = getConfig().prefixes.find(p => msg.content.startsWith(p));
	if (!prefix) return;

	const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/\s+/); 
	
	const command = client.commands.get(cmd);
	if (!command) return reply(msg, { type: "error", desc: `\`${cmd}\` is not a command`});

	try {
		command.execute(client, msg, args);
	} catch (err) {
		logError(`[${command.name}] ${err}`);

		reply(msg, { type: "error", desc: "Something went wrong"})
	}
	 
});

process.on("uncaughtException", logError);
process.on("unhandledRejection", logError);

const start = async () => {
	await loadConfig();
	await loadCommands();
	watchCommands(client);
	client.login(process.env.TOKEN);
}

start();