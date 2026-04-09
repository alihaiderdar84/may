import { Client, Events, GatewayIntentBits } from "discord.js";
import fs from "fs/promises";
import path from "path";
import { loadConfig, getConfig } from "./utils/configWatcher.js";

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

const loadCommands = async (client) => {
	const files = await fs.readdir("./commands")
	const commandFiles = files.filter(f => f.endsWith(".js"));

	for (const file of commandFiles) {
		const command = await import(`./commands/${file}`);
		client.commands.set(command.default.name, command.default)
	}
}

client.once("clientReady", () => {
	console.log(`Logged in as ${client.user.tag}`)
	loadCommands(client);
});



client.on("messageCreate", msg => {
	if (msg.author.bot || msg.author.id !== "1464193879493574762") return;

	const prefix = getConfig().prefixes.find(p => msg.content.startsWith(p));
	if (!prefix) return;

	const [cmd, ...args] = msg.content.slice(prefix.length).trim().split(/\s+/); 
	
	client.commands.has(cmd) ? client.commands.get(cmd).execute(msg, args) : console.error(`\`${cmd}\` is not a commmand`)
});

const start = async () => {
	await loadConfig();
	client.login(getConfig().token);
}

start();